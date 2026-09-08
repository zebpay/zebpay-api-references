const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const test = require('node:test');

const FuturesApiClient = require('../client');
const AuthUtils = require('../utils/auth');

function createCapturedClient() {
  const client = new FuturesApiClient({
    apiKey: 'test-api-key',
    secretKey: 'test-secret'
  });
  let captured;
  client.http.request = async (request) => {
    captured = request;
    return { data: { ok: true } };
  };
  return { client, getCaptured: () => captured };
}

function sign(value) {
  return crypto.createHmac('sha256', 'test-secret').update(value).digest('hex');
}

test('client exposes every route in the Futures API controllers', () => {
  const { client } = createCapturedClient();
  const methods = [
    'fetchMarkets', 'getOrderBook', 'getTicker24Hr', 'getMarketInfo',
    'getAggTrade', 'getKlines', 'getSystemTime', 'getSystemStatus',
    'getTradeFee', 'getTradeFees', 'getExchangeInfo', 'getPairs',
    'getBalance', 'createOrder', 'cancelOrder', 'editOrder',
    'cancelAllOrders', 'getOrder', 'addTPSLOrder', 'addMargin',
    'reduceMargin', 'closePosition', 'getOpenOrders', 'getPositions',
    'getUserLeverage', 'getUserLeverages', 'updateLeverage',
    'getOrderHistory', 'getTradeHistory', 'getTransactionHistory'
  ];

  assert.equal(methods.length, 30);
  for (const method of methods) {
    assert.equal(typeof client[method], 'function', `${method} is missing`);
  }
});

test('JWT and API-key credentials cannot be configured together', () => {
  assert.throws(
    () => new FuturesApiClient({
      jwt: 'jwt',
      apiKey: 'api-key',
      secretKey: 'secret'
    }),
    /mutually exclusive/
  );
});

test('public-only client requires credentials only for private methods', async () => {
  const client = new FuturesApiClient();
  let captured;
  client.http.request = async (request) => {
    captured = request;
    return { data: { ok: true } };
  };

  await client.getSystemTime();
  assert.deepEqual(captured.headers, {});
  await assert.rejects(
    client.getBalance(),
    /required for private endpoints/
  );
  assert.throws(
    () => new FuturesApiClient({ apiKey: 'incomplete' }),
    /Both apiKey and secretKey/
  );
});

test('API-key GET signs and transmits the same query parameters', async () => {
  const { client, getCaptured } = createCapturedClient();

  await client._request('GET', '/api/v1/trade/positions', {
    symbols: ['BTCUSDT', 'ETHUSDT']
  });

  const request = getCaptured();
  assert.equal(typeof request.params.timestamp, 'number');
  const query = request.paramsSerializer.serialize(request.params);
  assert.equal(query, AuthUtils.serializeQueryParams(request.params));
  assert.match(query, /^symbols=BTCUSDT&symbols=ETHUSDT&timestamp=/);
  assert.equal(request.headers['x-auth-signature'], sign(query));
});

test('API-key write signs and transmits the same JSON body', async () => {
  const { client, getCaptured } = createCapturedClient();

  await client.cancelOrder({
    clientOrderId: 'order-123',
    symbol: 'btcusdt'
  });

  const request = getCaptured();
  assert.equal(request.data.symbol, 'BTCUSDT');
  assert.equal(typeof request.data.timestamp, 'number');
  assert.equal(request.headers['x-auth-signature'], sign(JSON.stringify(request.data)));
});

test('API-key cancel-all sends a timestamp-only DELETE body', async () => {
  const { client, getCaptured } = createCapturedClient();

  await client.cancelAllOrders();

  const request = getCaptured();
  assert.deepEqual(Object.keys(request.data), ['timestamp']);
  assert.equal(request.headers['x-auth-signature'], sign(JSON.stringify(request.data)));
});

test('STOP_LIMIT validation follows server-side price rules', async () => {
  const { client, getCaptured } = createCapturedClient();

  await client.createOrder({
    symbol: 'btcusdt',
    amount: 0.01,
    side: 'buy',
    type: 'stop_limit',
    price: 66000,
    triggerPrice: 65500
  });

  assert.equal(getCaptured().data.type, 'STOP_LIMIT');
  await assert.rejects(
    client.createOrder({
      symbol: 'BTCUSDT',
      amount: 0.01,
      side: 'BUY',
      type: 'STOP_LIMIT',
      price: 65000,
      triggerPrice: 65500
    }),
    /price must be >= triggerPrice/
  );
});

test('addTPSLOrder requires a symbol and exactly one trigger', async () => {
  const { client } = createCapturedClient();
  const base = {
    positionId: 'position-123',
    amount: 0.01,
    side: 'SELL',
    symbol: 'BTCUSDT'
  };

  await assert.rejects(
    client.addTPSLOrder({
      ...base,
      stopLossPrice: 62000,
      takeProfitPrice: 70000
    }),
    /Exactly one/
  );
  await assert.rejects(
    client.addTPSLOrder({
      positionId: base.positionId,
      amount: base.amount,
      side: base.side,
      stopLossPrice: 62000
    }),
    /symbol/
  );
});

test('getKlines maps aliases and omits unsupported body fields', async () => {
  const { client, getCaptured } = createCapturedClient();

  await client.getKlines({
    symbol: 'btcusdt',
    interval: '1h',
    startTime: 1712345678000,
    endTime: 1712349278000,
    limit: 50,
    priceType: 'MARK_PRICE'
  });

  const captured = getCaptured();
  assert.equal(captured.method, 'POST');
  assert.match(captured.url, /\/api\/v1\/market\/klines$/);
  assert.deepEqual(captured.params, { priceType: 'MARK_PRICE' });
  assert.deepEqual(captured.data, {
    symbol: 'BTCUSDT',
    timeframe: '1h',
    since: 1712345678000,
    limit: 50
  });

  await assert.rejects(
    client.getKlines({ symbol: 'BTCUSDT' }),
    /timeframe/
  );
});

test('history methods forward extra filters as query params', async () => {
  const { client, getCaptured } = createCapturedClient();

  await client.getOrderHistory({
    pageSize: 10,
    startTimestamp: 1,
    endTimestamp: 2,
    sortOrder: 'asc',
    symbol: 'btcusdt'
  });

  let captured = getCaptured();
  assert.equal(captured.params.pageSize, 10);
  assert.equal(captured.params.startTimestamp, 1);
  assert.equal(captured.params.endTimestamp, 2);
  assert.equal(captured.params.sortOrder, 'asc');
  assert.equal(captured.params.symbol, 'BTCUSDT');

  await client.getTransactionHistory({ tradeId: 17909 });
  captured = getCaptured();
  assert.equal(captured.params.tradeId, 17909);
});
