const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const http = require('node:http');
const test = require('node:test');

const FuturesApiClient = require('../client');
const config = require('../utils/config');

const API_KEY = 'integration-api-key';
const SECRET_KEY = 'integration-secret';

async function withCaptureServer(run) {
  let resolveRequest;
  const requestReceived = new Promise((resolve) => {
    resolveRequest = resolve;
  });
  const server = http.createServer((request, response) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => {
      resolveRequest({
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: Buffer.concat(chunks).toString('utf8')
      });
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end('{"ok":true}');
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const previousBaseUrl = config.baseUrl;
  config.baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    const result = await run();
    return { result, request: await requestReceived };
  } finally {
    config.baseUrl = previousBaseUrl;
    await new Promise((resolve) => server.close(resolve));
  }
}

function sign(value) {
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(value)
    .digest('hex');
}

test('transmits exactly the JSON body signed for API-key writes', async () => {
  const client = new FuturesApiClient({
    apiKey: API_KEY,
    secretKey: SECRET_KEY
  });
  const { request } = await withCaptureServer(() => client._request(
    'POST',
    '/api/v1/trade/addMargin',
    {},
    { positionId: 'position-123', amount: 100 }
  ));

  assert.equal(request.method, 'POST');
  assert.match(
    request.body,
    /^\{"positionId":"position-123","amount":100,"timestamp":\d+\}$/
  );
  assert.equal(request.headers['x-auth-signature'], sign(request.body));
});

test('transmits exactly the query string signed for API-key reads', async () => {
  const client = new FuturesApiClient({
    apiKey: API_KEY,
    secretKey: SECRET_KEY
  });
  const { request } = await withCaptureServer(() => client._request(
    'GET',
    '/api/v1/trade/positions',
    { symbols: ['BTCUSDT', 'ETHUSDT'] }
  ));
  const query = request.url.split('?')[1];

  assert.match(
    query,
    /^symbols=BTCUSDT&symbols=ETHUSDT&timestamp=\d+$/
  );
  assert.equal(request.headers['x-auth-signature'], sign(query));
});

test('sends JWT authorization through the real HTTP transport', async () => {
  const client = new FuturesApiClient({ jwt: 'integration-jwt' });
  const { request } = await withCaptureServer(() => client._request(
    'POST',
    '/api/v1/trade/addMargin',
    {},
    { positionId: 'position-123', amount: 100 }
  ));

  assert.equal(request.headers.authorization, 'Bearer integration-jwt');
  assert.deepEqual(
    JSON.parse(request.body),
    { positionId: 'position-123', amount: 100 }
  );
});
