const { EventEmitter } = require('node:events');
const { io } = require('socket.io-client');
const { createApiKeyAuth, normalizeSubaccountId } = require('./auth');

const PRIVATE_EVENTS = Object.freeze([
  'newOrder',
  'orderFilled',
  'orderPartiallyFilled',
  'orderCancelled',
  'orderFailed',
  'newPosition',
  'updatePosition',
  'closePosition',
  'balanceUpdate',
  'newTrade',
  'autoTopupSuccess',
  'autoTopupFailed',
  'marginCallAlert',
  'liquidationAlert'
]);

class FuturesPrivateWebSocketClient extends EventEmitter {
  constructor(options = {}) {
    super();

    const {
      jwt,
      tokenProvider,
      clientType = 'api',
      apiKey,
      secretKey,
      subaccountId,
      baseUrl = 'https://futuresws.zebpay.com',
      namespace = '/auth-stream',
      path = '/socket.io',
      timeout = 20000,
      socketOptions = {},
      socketFactory = io,
      now = Date.now
    } = options;

    const jwtMethodCount = Number(Boolean(jwt)) + Number(Boolean(tokenProvider));
    const hasApiKeyCredentials = Boolean(apiKey || secretKey);
    if (jwtMethodCount > 1) {
      throw new Error('Provide either jwt or tokenProvider, not both.');
    }
    if (jwtMethodCount > 0 && hasApiKeyCredentials) {
      throw new Error('JWT and API key authentication are mutually exclusive.');
    }
    if (jwtMethodCount === 0 && !hasApiKeyCredentials) {
      throw new Error('Provide JWT credentials or an API key and secret key.');
    }
    if (hasApiKeyCredentials && (!apiKey || !secretKey)) {
      throw new Error('Both apiKey and secretKey are required.');
    }
    if (tokenProvider && typeof tokenProvider !== 'function') {
      throw new Error('tokenProvider must be a function.');
    }
    if (!['api', 'ui'].includes(clientType)) {
      throw new Error('clientType must be "api" or "ui".');
    }
    if (typeof socketFactory !== 'function') {
      throw new Error('socketFactory must be a function.');
    }
    if (typeof now !== 'function') {
      throw new Error('now must be a function.');
    }

    this.jwt = jwt;
    this.tokenProvider = tokenProvider;
    this.clientType = clientType;
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.subaccountId = normalizeSubaccountId(subaccountId);
    this.now = now;
    this.authenticated = false;
    this.authDetails = null;

    const normalizedBaseUrl = String(baseUrl).replace(/\/+$/, '');
    const normalizedNamespace = namespace.startsWith('/')
      ? namespace
      : `/${namespace}`;
    const namespaceUrl = `${normalizedBaseUrl}${normalizedNamespace}`;

    this.socket = socketFactory(namespaceUrl, {
      ...socketOptions,
      path,
      transports: ['websocket'],
      autoConnect: false,
      reconnection: false,
      timeout,
      auth: (callback) => {
        this.buildAuth()
          .then(callback)
          .catch((error) => {
            this.emit('credential_error', error);
            callback({});
          });
      }
    });

    this._registerSocketListeners();
  }

  async buildAuth() {
    if (this.apiKey) {
      return createApiKeyAuth({
        apiKey: this.apiKey,
        secretKey: this.secretKey,
        subaccountId: this.subaccountId,
        timestamp: this.now()
      });
    }

    const token = this.tokenProvider
      ? await this.tokenProvider()
      : this.jwt;
    if (!token || typeof token !== 'string') {
      throw new Error('JWT token provider returned an empty token.');
    }
    return {
      clientType: this.clientType,
      token,
      ...(this.subaccountId ? { subaccountId: this.subaccountId } : {})
    };
  }

  connect() {
    this.socket.connect();
    return this;
  }

  disconnect() {
    this.socket.disconnect();
    return this;
  }

  waitForAuth(timeoutMs = 10000) {
    if (this.authenticated) {
      return Promise.resolve(this.authDetails);
    }

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        this.off('auth.ok', onSuccess);
        this.off('auth.error', onAuthError);
        this.off('connect_error', onConnectError);
        this.off('credential_error', onCredentialError);
      };
      const onSuccess = (details) => {
        cleanup();
        resolve(details);
      };
      const onAuthError = (error) => {
        cleanup();
        reject(new Error(error?.message || 'WebSocket authentication failed'));
      };
      const onConnectError = (error) => {
        cleanup();
        reject(error instanceof Error ? error : new Error(String(error)));
      };
      const onCredentialError = (error) => {
        cleanup();
        reject(error);
      };
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Timed out waiting for auth.ok after ${timeoutMs}ms`));
      }, timeoutMs);

      this.once('auth.ok', onSuccess);
      this.once('auth.error', onAuthError);
      this.once('connect_error', onConnectError);
      this.once('credential_error', onCredentialError);
    });
  }

  _registerSocketListeners() {
    this.socket.on('connect', () => {
      this.emit('connect', this.socket.id);
    });
    this.socket.on('auth.ok', (details) => {
      this.authenticated = true;
      this.authDetails = details;
      this.emit('auth.ok', details);
    });
    this.socket.on('auth.error', (error) => {
      this.authenticated = false;
      this.authDetails = null;
      this.emit('auth.error', error);
    });
    this.socket.on('connect_error', (error) => {
      this.emit('connect_error', error);
    });
    this.socket.on('disconnect', (reason, details) => {
      this.authenticated = false;
      this.authDetails = null;
      this.emit('disconnect', reason, details);
    });

    for (const eventName of PRIVATE_EVENTS) {
      this.socket.on(eventName, (payload) => {
        this.emit(eventName, payload);
      });
    }

  }
}

module.exports = {
  FuturesPrivateWebSocketClient,
  PRIVATE_EVENTS
};
