const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const test = require('node:test');

const { createApiKeyAuth } = require('../auth');
const {
  FuturesPrivateWebSocketClient,
  PRIVATE_EVENTS
} = require('../client');

class FakeSocket extends EventEmitter {
  constructor() {
    super();
    this.id = 'socket-123';
    this.io = new EventEmitter();
    this.connectCalls = 0;
    this.disconnectCalls = 0;
  }

  connect() {
    this.connectCalls += 1;
    return this;
  }

  disconnect() {
    this.disconnectCalls += 1;
    return this;
  }
}

function createSocketFactory() {
  const fakeSocket = new FakeSocket();
  const calls = [];
  const socketFactory = (url, options) => {
    calls.push({ url, options });
    return fakeSocket;
  };
  return { fakeSocket, calls, socketFactory };
}

function resolveAuth(authCallback) {
  return new Promise((resolve) => authCallback(resolve));
}

test('creates the exact root and subaccount HMAC payloads', () => {
  const timestamp = 1750000000000;
  const secretKey = 'test-secret';
  const root = createApiKeyAuth({
    apiKey: 'api-key',
    secretKey,
    timestamp
  });
  const subaccount = createApiKeyAuth({
    apiKey: 'api-key',
    secretKey,
    timestamp,
    subaccountId: 456
  });
  const sign = (payload) => crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex');

  assert.equal(root.signature, sign('{"timestamp":1750000000000}'));
  assert.equal(
    subaccount.signature,
    sign('{"timestamp":1750000000000,"subaccountId":"456"}')
  );
  assert.equal(subaccount.subaccountId, '456');
});

test('API-key auth callback generates fresh credentials per explicit connection', async () => {
  const { calls, socketFactory } = createSocketFactory();
  let timestamp = 1750000000000;
  new FuturesPrivateWebSocketClient({
    apiKey: 'api-key',
    secretKey: 'test-secret',
    socketFactory,
    now: () => timestamp++
  });

  const first = await resolveAuth(calls[0].options.auth);
  const second = await resolveAuth(calls[0].options.auth);

  assert.equal(calls[0].url, 'https://sp-futuresws.zebpay.com/auth-stream');
  assert.equal(calls[0].options.path, '/socket.io');
  assert.deepEqual(calls[0].options.transports, ['websocket']);
  assert.equal(calls[0].options.reconnection, false);
  assert.equal(first.timestamp, 1750000000000);
  assert.equal(second.timestamp, 1750000000001);
  assert.notEqual(first.signature, second.signature);
});

test('supports static and provider-based JWT authentication', async () => {
  const staticFactory = createSocketFactory();
  new FuturesPrivateWebSocketClient({
    jwt: 'static-jwt',
    clientType: 'ui',
    subaccountId: '456',
    socketFactory: staticFactory.socketFactory
  });
  assert.deepEqual(
    await resolveAuth(staticFactory.calls[0].options.auth),
    {
      clientType: 'ui',
      token: 'static-jwt',
      subaccountId: '456'
    }
  );

  const providerFactory = createSocketFactory();
  let callCount = 0;
  new FuturesPrivateWebSocketClient({
    tokenProvider: async () => `jwt-${++callCount}`,
    socketFactory: providerFactory.socketFactory
  });
  assert.equal(
    (await resolveAuth(providerFactory.calls[0].options.auth)).token,
    'jwt-1'
  );
  assert.equal(
    (await resolveAuth(providerFactory.calls[0].options.auth)).token,
    'jwt-2'
  );
});

test('rejects ambiguous or incomplete authentication configuration', () => {
  assert.throws(
    () => new FuturesPrivateWebSocketClient({
      jwt: 'jwt',
      apiKey: 'api-key',
      secretKey: 'secret'
    }),
    /mutually exclusive/
  );
  assert.throws(
    () => new FuturesPrivateWebSocketClient({ apiKey: 'api-key' }),
    /Both apiKey and secretKey/
  );
  assert.throws(
    () => new FuturesPrivateWebSocketClient({
      jwt: 'jwt',
      tokenProvider: () => 'jwt'
    }),
    /either jwt or tokenProvider/
  );
});

test('relays lifecycle and all private business events', async () => {
  const { fakeSocket, socketFactory } = createSocketFactory();
  const client = new FuturesPrivateWebSocketClient({
    jwt: 'jwt',
    socketFactory
  });
  const received = new Map();

  for (const eventName of PRIVATE_EVENTS) {
    client.on(eventName, (payload) => received.set(eventName, payload));
    fakeSocket.emit(eventName, { eventName });
  }
  assert.equal(received.size, 14);

  const authPromise = client.waitForAuth();
  fakeSocket.emit('auth.ok', { accountId: '123' });
  assert.deepEqual(await authPromise, { accountId: '123' });
  assert.equal(client.authenticated, true);

  fakeSocket.emit('disconnect', 'transport close');
  assert.equal(client.authenticated, false);
});

test('connect and disconnect delegate to the Socket.IO client', () => {
  const { fakeSocket, socketFactory } = createSocketFactory();
  const client = new FuturesPrivateWebSocketClient({
    jwt: 'jwt',
    socketFactory
  });

  assert.equal(client.connect(), client);
  assert.equal(client.disconnect(), client);
  assert.equal(fakeSocket.connectCalls, 1);
  assert.equal(fakeSocket.disconnectCalls, 1);
});
