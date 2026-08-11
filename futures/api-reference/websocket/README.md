# Futures Private WebSocket

The private Futures WebSocket delivers account-specific order, position, balance, trade, margin, and liquidation events in real time.

## Connection Contract

- **Service URL:** `https://futuresws.zebpay.com`
- **Namespace:** `/auth-stream`
- **Socket.IO path:** `/socket.io`
- **Transport:** WebSocket
- **Recommended Node.js namespace URL:** `https://futuresws.zebpay.com/auth-stream`
- **Protocol:** Socket.IO, not a raw WebSocket connection

Use a Socket.IO 4 client configured for Engine.IO 4 (`EIO=4`). The service source snapshot does not include a dependency manifest that pins an exact deployed patch version, so applications should not depend on version-specific behavior beyond the documented contract.

## Authentication

The private stream supports:

1. **API Key + Secret (recommended for programmatic clients)** — HMAC-SHA256 credentials are sent in the Socket.IO `auth` object. The API key must have `fetch:details`.
2. **JWT** — retained for compatible UI or API-token clients.

API-key connections do not require a web-session JWT. See [WebSocket Authentication](./authentication.md) for the exact handshake and signature payload.

## Connection Lifecycle

1. Open the `/auth-stream` Socket.IO namespace using WebSocket transport.
2. Supply credentials in the Socket.IO `auth` object.
3. The Socket.IO `connect` event confirms the namespace connection.
4. Wait for `auth.ok` before treating the private stream as authenticated.
5. On failure, the service emits `auth.error` and then disconnects the socket.
6. Generate a fresh timestamp and HMAC before every explicit connection.

The sample clients and examples do not automatically retry or reconnect. A caller may make a later explicit connection after handling the failure or disconnect.

## Documentation

- [Authentication and subaccounts](./authentication.md)
- [Private event list and delivery behavior](./events.md)
- [Short Node.js and Python examples](../../examples/websocket/private-stream.md)
- [Node.js private WebSocket client](../../clients/websocket/node/README.md)
- [Python private WebSocket client](../../clients/websocket/python/README.md)

## Diagnosing `Invalid namespace`

`Invalid namespace` is a Socket.IO routing error raised before private authentication runs. It means the namespace requested by the client is unavailable—for example, the client used the default or a misspelled namespace, or the deployed host does not currently expose `/auth-stream`. Verify that the namespace URL ends in `/auth-stream`; changing JWT or HMAC fields will not fix this error.

Once the namespace is available, credential and account failures—including credentials supplied outside the Socket.IO `auth` object or an incorrect `clientType` field—are reported through `auth.error`.
