# Zebpay Spot & Futures API Documentation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Welcome to the official documentation repository for the Zebpay Spot and Futures REST APIs. This repository provides comprehensive resources for developers looking to integrate with our trading platforms via API.

**Note:** The Spot API documentation is currently under development. It will eventually mirror the structure of the Futures documentation.

## Key Information & Quick Links
* **Spot API Base URL:** `https://api.zebpay.com` (version: v2)
* **Futures API Base URL:** `https://futuresbe.zebpay.com` (version: v1)
* **Getting Started (Spot):** [Spot Getting Started Guide](./spot/api-reference/getting-started.md)
* **Getting Started (Futures):** [Futures Getting Started Guide](./futures/api-reference/getting-started.md)


## 📚 Documentation Sections

This repository is organized into two main product areas:

1.  **[Futures API](./futures/README.md)**:
    * **[API Reference](./futures/api-reference)**: Detailed explanations of core concepts like [Authentication](./futures/api-reference/authentication.md), [Data Models](./futures/api-reference/data-models.md), [Error Handling](./futures/api-reference/error-handling.md), and [Rate Limits](./futures/api-reference/rate-limits.md). Complete reference for all [Public Endpoints](./futures/api-reference/public-endpoints) (Market, System, Exchange) and [Private Endpoints](./futures/api-reference/private-endpoints) (Trade, Wallet).
    * **[Client Libraries](./futures/clients)**: Ready-to-use client libraries:
        * **REST/HTTP Clients**: [Node.js](./futures/clients/rest-http/node/README.md), [Python](./futures/clients/rest-http/python/README.md)
        * **CCXT Integration**: [Node.js (via CCXT)](./futures/clients/ccxt/node/README.md) - *Note: Integration is pending CCXT approval under the `zebpayfutures` identifier* .
    * **[Examples](./futures/examples)**: Practical code examples using `cURL`, Node.js, and Python for various [Public](./futures/examples/public) and [Private](./futures/examples/private) endpoints.

2.  **[Spot API](./spot)**:
    * **[API Reference](./spot/api-reference/README.md)**: Covers core concepts like [Authentication](./spot/api-reference/authentication.md), [Data Models](./spot/api-reference/data-models.md), [Error Handling](./spot/api-reference/error-handling.md), and [Rate Limits](./spot/api-reference/rate-limits.md). Includes references for [Public](./spot/api-reference/public-endpoints.md) and [Private](./spot/api-reference/private-endpoints.md) endpoints.
    * **[Client Libraries](./spot/clients)**:
        * **REST/HTTP Clients**: [Node.js](./spot/clients/rest-http/node/), [Python](./spot/clients/rest-http/python/README.md)
        * **CCXT Integration**: *(Planned)* - A CCXT client for Spot is planned for future implementation.
    * **[Examples](./spot/examples)**: *(In Progress)* Will include examples similar to the Futures section. Currently contains a Python example .


## 📜 License

This project is licensed under the MIT License - see the LICENSE file (if available) for details. *(Assumption based on package files like )*

## 🤝 Contributing & Support

Please refer to the contribution guidelines if you wish to contribute. For issues or questions, please open an issue in this repository.

Happy Trading!
