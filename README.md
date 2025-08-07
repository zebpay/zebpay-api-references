# Zebpay Spot & Futures API Documentation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Welcome to the official documentation repository for the Zebpay Spot and Futures APIs. This repository contains everything you need to build trading, portfolio-management or analytic applications on top of Zebpay.

**Note:** Spot documentation is an active work-in-progress and will eventually match the structure of the Futures docs.

## 🔑  Key Information & Quick Links

* **Spot REST API Base URL:** `https://api.zebpay.com` (version: v2)
* **Futures REST API Base URL:** `https://futuresbe.zebpay.com` (version: v1)
* **Futures Webhooks – Management Base URL:** `https://futuresbe.zebpay.com` (version: v1)
* **Futures Webhooks – Event Delivery URL:** Your own HTTPS endpoint configured when creating a webhook.
* **Getting Started – Spot:** [Quickstart](./spot/api-reference/getting-started.md)
* **Getting Started – Futures REST:** [Quickstart](./futures/rest-api/reference-docs/getting-started.md)
* **Getting Started – Futures Webhooks:** [Webhooks Overview](./futures/webhooks/reference-docs/event-listener.md)

## 📚 Repository Layout

| Product | Location | Docs | Clients | Examples |
|---------|----------|------|---------|----------|
| **Spot REST API** | `./spot` | [Reference](./spot/api-reference/README.md) | [Node.js](./spot/clients/rest-http/node/) / [Python](./spot/clients/rest-http/python/README.md) | — |
| **Futures REST API** | `./futures/rest-api` | [Reference](./futures/rest-api/reference-docs)| [Node.js](./futures/rest-api/clients/http/node/README.md) / [Python](./futures/rest-api/clients/http/python/README.md) / [CCXT](./futures/rest-api/clients/ccxt/node/README.md) | [Examples](./futures/rest-api/examples) |
| **Futures Webhooks** | `./futures/webhooks` | [Reference](./futures/webhooks/reference-docs) | — | [Examples](./futures/webhooks/examples) |

## 📜 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing & Support

Issues and pull requests are welcome! Please check the contribution guidelines first.

Happy trading!
