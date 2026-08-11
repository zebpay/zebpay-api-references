# Zebpay Futures — Developer Documentation

The **Zebpay Futures** product offers three complementary integration surfaces:

1. **REST API** – programmatic access for placing orders, querying account information and retrieving market data.
2. **Private WebSocket** – authenticated live order, position, balance, trade, and risk events.
3. **Webhooks** – push-style notifications to automate trading strategies triggered by external events.

This directory contains documentation, client libraries and examples for all three surfaces.

## 📚 Documentation Map

| Surface | Location | Docs | Clients | Examples |
|---------|----------|------|---------|----------|
| **REST API** | `./` | [Reference](./api-reference) | [Node.js](./clients/rest-http/node/README.md) / [Python](./clients/rest-http/python/README.md) / [CCXT](./clients/ccxt/node/README.md) | [Examples](./examples) |
| **Private WebSocket** | `./api-reference/websocket` | [Reference](./api-reference/websocket/README.md) | [Node.js](./clients/websocket/node/README.md) / [Python](./clients/websocket/python/README.md) | [Examples](./examples/websocket/private-stream.md) |
| **Webhooks** | `./webhooks` | [Reference](./webhooks/reference-docs) | — | [Examples](./webhooks/examples) |

### REST API Highlights
* Covers **public** (Market, Exchange, System) and **private** (Trade, Wallet) endpoints.
* Authenticate private REST calls with JWT or API Key + Secret (HMAC-SHA256).
* Start with the [Getting Started guide](./api-reference/getting-started.md).

### Private WebSocket Highlights
* Connect to the Socket.IO `/auth-stream` namespace over WebSocket transport.
* Authenticate with an API key and HMAC-SHA256; no web-session JWT is required.
* Receive 14 order, position, balance, trade, and risk events.
* Start with the [Private WebSocket overview](./api-reference/websocket/README.md), then use the [Node.js](./clients/websocket/node/README.md) or [Python](./clients/websocket/python/README.md) client.

### One API Key for REST and Private WebSocket

To run without a web-session JWT, create one key in the [ZebPay API portal](https://api.zebpay.com) with both scopes:

- `futures:trading` for REST trading and write operations.
- `fetch:details` for private WebSocket authentication and read-only private data.

The same API Key + Secret can then authenticate both REST and `/auth-stream`; do not send the secret to either service.

### Webhooks Highlights
* Subscribe to order-lifecycle events, position changes and more.
* Two parts:
  * **Management Endpoints** (create, list, pause …) – authenticated REST calls.
  * **Event Listener** – HTTPS callback on your infrastructure signed with a shared secret.
* Begin with [Authentication](./webhooks/reference-docs/authentication.md) and the [Event Listener guide](./webhooks/reference-docs/event-listener.md).

## 🤝 Contributing & Support
Please open an issue for questions or suggestions. Pull requests are welcome!

Happy trading!
