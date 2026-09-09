const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const http = require('node:http');
const test = require('node:test');
const { Server } = require('socket.io');

const {
  FuturesPrivateWebSocketClient,
  PRIVATE_EVENTS
} = require('../client');

const API_KEY = 'integration-api-key';
const SECRET_KEY = 'integration-secret';
const JWT = 'integration-jwt';

function validateAuth(auth) {
  if (auth.apiKey === API_KEY) {
    const payload = auth.subaccountId
      ? JSON.stringify({
          timestamp: auth.timestamp,
          subaccountId: auth.subaccountId
        })
      : JSON.stringify({ timestamp: auth.timestamp });
    const expected = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payload)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(auth.signature || ''),
      Buffer.from(expected)
    );
  }
  return auth.clientType === 'api' && auth.token === JWT;
}

async function startServer() {
  const httpServer = http.createServer();
  const io = new Server(httpServer, {
    transports: ['websocket']
  });
  const receivedAuth = [];

  io.of('/auth-stream').on('connection', (socket) => {
    const auth = socket.handshake.auth;
    receivedAuth.push(auth);
    if (!validateAuth(auth)) {
      socket.emit('auth.error', {
        code: 401,
        message: 'invalid integration credentials'
      });
      socket.disconnect(true);
      return;
    }

    socket.emit('auth.ok', {
      accountId: auth.subaccountId || 'root-account'
    });
    for (const eventName of PRIVATE_EVENTS) {
      socket.emit(eventName, { eventName });
    }
  });

  await new Promise((resolve) => {
    httpServer.listen(0, '127.0.0.1', resolve);
  });
  const address = httpServer.address();

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    receivedAuth,
    close: () => new Promise((resolve) => io.close(resolve))
  };
}

function waitForAllEvents(client, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const received = new Set();
    const timer = setTimeout(() => {
      reject(new Error(
        `Received ${received.size}/${PRIVATE_EVENTS.length} private events`
      ));
    }, timeoutMs);

    for (const eventName of PRIVATE_EVENTS) {
      client.on(eventName, (payload) => {
        assert.equal(payload.eventName, eventName);
        received.add(eventName);
        if (received.size === PRIVATE_EVENTS.length) {
          clearTimeout(timer);
          resolve(received);
        }
      });
    }
  });
}

test('API-key client authenticates and receives events over WebSocket', async () => {
  const server = await startServer();
  const client = new FuturesPrivateWebSocketClient({
    apiKey: API_KEY,
    secretKey: SECRET_KEY,
    subaccountId: '456',
    baseUrl: server.baseUrl,
    reconnection: false
  });

  try {
    const allEvents = waitForAllEvents(client);
    client.connect();
    assert.deepEqual(
      await client.waitForAuth(),
      { accountId: '456' }
    );
    assert.equal((await allEvents).size, 14);
    assert.equal(server.receivedAuth[0].subaccountId, '456');
    assert.equal(server.receivedAuth[0].secretKey, undefined);
  } finally {
    client.disconnect();
    await server.close();
  }
});

test('JWT client authenticates over the real Socket.IO transport', async () => {
  const server = await startServer();
  const client = new FuturesPrivateWebSocketClient({
    tokenProvider: async () => JWT,
    baseUrl: server.baseUrl,
    reconnection: false
  });

  try {
    client.connect();
    assert.deepEqual(
      await client.waitForAuth(),
      { accountId: 'root-account' }
    );
    assert.equal(server.receivedAuth[0].token, JWT);
  } finally {
    client.disconnect();
    await server.close();
  }
});

test('client surfaces auth.error from the application handshake', async () => {
  const server = await startServer();
  const client = new FuturesPrivateWebSocketClient({
    apiKey: 'invalid-api-key',
    secretKey: 'invalid-secret',
    baseUrl: server.baseUrl,
    reconnection: false
  });

  try {
    const authResult = client.waitForAuth();
    client.connect();
    await assert.rejects(authResult, /invalid integration credentials/);
  } finally {
    client.disconnect();
    await server.close();
  }
});
