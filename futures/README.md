# Zebpay Futures API Documentation

Welcome to the official documentation repository for the Zebpay Futures REST API. This repository provides comprehensive resources to help you integrate with our futures trading platform.

## 📚 Documentation Sections

This repository is organized into the following main sections:

1.  **[API Reference](api-reference)**:
    * Detailed explanations of core concepts like [Authentication](api-reference/authentication.md) , [Data Models](api-reference/data-models.md) , [Error Handling](api-reference/error-handling.md) , and [Rate Limits](api-reference/rate-limits.md) .
    * Complete reference for all [Public Endpoints](api-reference/public-endpoints) (Market, System, Exchange) and [Private Endpoints](api-reference/private-endpoints) (Trade, Wallet) .
    * Includes information on request parameters, response structures, and authentication requirements .
    * Start here: [Getting Started Guide](api-reference/getting-started.md) .

2.  **[Client Libraries](clients)**:
    * Ready-to-use client libraries to simplify interaction with the API.
    * **REST/HTTP Clients**:
        * [Node.js Client](clients/rest-http/node/README.md)
        * [Python Client](clients/rest-http/python/README.md)
    * **CCXT Integration**:
        * [Node.js (via CCXT)](clients/ccxt/node/README.md)  - *Note: Integration pending CCXT approval under `zebpayfutures` identifier.*

3.  **[Examples](examples)**:
    * Practical code examples demonstrating how to use various API endpoints.
    * Examples are provided for:
        * `cURL`
        * Node.js (using the REST client)
        * Python (using the REST client)
    * Covers both [Public Examples](examples/public) and [Private Examples](examples/private).

## 🤝 Contributing & Support

Please refer to the contribution guidelines if you wish to contribute. For issues or questions, please open an issue in this repository.

Happy Trading!
