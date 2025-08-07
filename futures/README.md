# Zebpay Futures — Developer Documentation

The **Zebpay Futures** product offers two complementary integration surfaces:

1. **REST API** – programmatic access for placing orders, querying account information and retrieving market data.
2. **Webhooks** – push-style notifications to automate trading strategies triggered by external events.

This directory contains documentation, client libraries and examples for both surfaces.

## 📚 Documentation Map

| Surface | Location | Docs | Clients | Examples |
|---------|----------|------|---------|----------|
| **REST API** | `./rest-api` | [Reference](./rest-api/reference-docs) | [Node.js](./rest-api/clients/http/node/README.md) / [Python](./rest-api/clients/http/python/README.md) / [CCXT](./rest-api/clients/ccxt/node/README.md) | [Examples](./rest-api/examples) |
| **Webhooks** | `./webhooks` | [Reference](./webhooks/reference-docs) | — | [Examples](./webhooks/examples) |

### REST API Highlights
* Covers **public** (Market, Exchange, System) and **private** (Trade, Wallet) endpoints.
* Auth with JWT, industry-standard rate limits and error semantics.
* Start with the [Getting Started guide](./rest-api/reference-docs/getting-started.md).

### Webhooks Highlights
* Subscribe to order-lifecycle events, position changes and more.
* Two parts:
  * **Management Endpoints** (create, list, pause …) – authenticated REST calls.
  * **Event Listener** – HTTPS callback on your infrastructure signed with a shared secret.
* Begin with [Authentication](./webhooks/reference-docs/authentication.md) and the [Event Listener guide](./webhooks/reference-docs/event-listener.md).

## 🤝 Contributing & Support
Please open an issue for questions or suggestions. Pull requests are welcome!

Happy trading!
