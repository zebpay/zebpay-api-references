# ZebPay Futures Private WebSocket Client — Node.js

This sample client connects to the Socket.IO `/auth-stream` namespace and relays all private Futures events through a Node.js `EventEmitter`.

This is a Socket.IO client over WebSocket transport, not a raw WebSocket or Server-Sent Events client.

**Service URL:** `https://sp-futuresws.zebpay.com`  
**Namespace URL:** `https://sp-futuresws.zebpay.com/auth-stream`

The client uses that host by default. Override it with `baseUrl` or `WEBSOCKET_BASE_URL`.

## Requirements

- Node.js 18 or newer
- An API key with `fetch:details`, or a supported JWT

For one API key that supports both this private stream and full REST trading, grant that key both `fetch:details` and `futures:trading`. The WebSocket handshake itself checks `fetch:details`.

## Install

```bash
npm install
```

## API Key + HMAC

```javascript
const { FuturesPrivateWebSocketClient } = require("./client");

const client = new FuturesPrivateWebSocketClient({
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
  subaccountId: process.env.SUBACCOUNT_ID || undefined
});

client.on("auth.ok", (details) => console.log("Authenticated", details));
client.on("orderFilled", (payload) => console.log("orderFilled", payload));
client.on("auth.error", (error) => console.error("Authentication failed", error));

client.connect();
```

The client regenerates the timestamp and HMAC through Socket.IO's dynamic `auth` callback for every explicit `connect()` call.

## JWT

Static JWT:

```javascript
const client = new FuturesPrivateWebSocketClient({
  jwt: process.env.JWT_TOKEN,
  clientType: "api"
});
```

Refreshable JWT:

```javascript
const client = new FuturesPrivateWebSocketClient({
  clientType: "api",
  tokenProvider: async () => getCurrentJwt()
});
```

The client requires exactly one authentication method. JWT and API-key credentials cannot be configured together. `clientType` must be `api` or `ui`.

## Wait for Authentication

Socket.IO's `connect` event occurs before application authentication finishes. Wait for `auth.ok`:

```javascript
client.connect();
const details = await client.waitForAuth(10000);
console.log("Ready:", details.accountId);
```

`waitForAuth()` rejects on `auth.error`, `connect_error`, credential-provider failure, or timeout.

## Events

Lifecycle and authentication:

- `connect`
- `auth.ok`
- `auth.error`
- `credential_error`
- `connect_error`
- `disconnect`

Private business events:

- `newOrder`
- `orderFilled`
- `orderPartiallyFilled`
- `orderCancelled`
- `orderFailed`
- `newPosition`
- `updatePosition`
- `closePosition`
- `balanceUpdate`
- `newTrade`
- `autoTopupSuccess`
- `autoTopupFailed`
- `marginCallAlert`
- `liquidationAlert`

`PRIVATE_EVENTS` is exported from `client.js` for registering listeners programmatically.

## Run the Complete Example

```bash
cp .env.example .env
# Edit .env, then:
npm start
```

The example supports `AUTH_METHOD=api_key` and `AUTH_METHOD=jwt`.

## Test

```bash
npm test
npm run check
```

Tests cover both mocked behavior and a real WebSocket connection to an in-process Socket.IO server. They never contact the live service.

## Connection Failure Notes

- This sample client disables automatic reconnection and does not retry failed connections.
- Connection and authentication failures are surfaced through `connect_error`, `credential_error`, `auth.error`, or `waitForAuth()`.
- If the caller explicitly invokes `connect()` again, HMAC credentials are rebuilt and a configured `tokenProvider` is called again.
- Reconcile open orders, positions, and balances through REST after `auth.ok`, because private events are live-only and are not replayed.

## Files

```text
.
├── auth.js
├── client.js
├── run.example.js
├── test/
│   ├── client.test.js
│   └── transport.integration.test.js
├── .env.example
└── package.json
```

See the [private WebSocket reference](../../../api-reference/websocket/README.md) for the protocol contract.
