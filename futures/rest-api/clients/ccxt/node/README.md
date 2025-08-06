# 📘 Zebpay Futures CCXT Client - Node.js

![Node.js](https://img.shields.io/badge/node-%3E%3D18-green) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📑 Table of Contents

1. [🧭 Overview](#-overview)
2. [⚡ Quickstart](#-quickstart)
3. [⚙️ Installation and Setup](#-installation-and-setup)
4. [🔐 Authentication Setup](#-authentication-setup)
5. [🚀 Client Initialization](#-client-initialization)
6. [📡 Client Methods](#-client-methods)
   - [🟢 Public Methods](#-public-methods)
   - [🔒 Private Methods](#-private-methods)
7. [🧪 Example Usage](#-example-usage)
9. [📌 Compatibility & Version](#-compatibility--version)
10. [🔗 Helpful Links](#-helpful-links)

---

## 🧭 Overview

The **Zebpay Futures CCXT Client - Node.js** is a CCXT integration for the Zebpay Futures API. It exposes the same method signatures and request/response structures as the native Node.js client so that you can seamlessly leverage the benefits of CCXT’s unified API interface.

Key features include:

- **Unified Methods:** Identical methods to your native client, making migration and integration easy.
- **Secure Authentication:** Supports both JWT and API Key/Secret methods.
- **CCXT Standards Compliant:** Follows CCXT’s conventions, enabling integration with other exchange interfaces.

> **Note:** The integration is pending approval from the CCXT team under the identifier `zebpayfutures`.

---

## ⚡ Quickstart

Once installed and configured, you can initialize the CCXT client and start accessing the Zebpay Futures API with familiar CCXT call patterns:

```javascript
const ccxt = require('ccxt');
require('dotenv').config(); // For loading API keys securely

const exchangeId = 'zebpayfutures'; // Exchange ID for CCXT
const exchangeClass = ccxt[exchangeId];

const client = new exchangeClass({
  apiKey: process.env.API_KEY,
  secret: process.env.SECRET_KEY, // zebpay apiKy and secret
});

(async () => {
  try {
    const status = await client.fetchStatus(); // Fetch exchange status
    console.log(`${client.name} Status:`, status);
  } catch (e) {
    console.error(`Error: ${e.constructor.name} - ${e.message}`);
  }
})();
```

---

## ⚙️ Installation and Setup

### Prerequisites

- **Node.js 18 or newer**

### Installing Dependencies

In your project’s root directory, install the required packages:

```bash
npm install
```

Also, ensure that you have installed the [ccxt](https://www.npmjs.com/package/ccxt) library as a peer dependency if it is not already part of your project.

---

## 🔐 Authentication Setup

The client supports **API Key & Secret Authentication**

Create a `.env` file in your project root with either of the following configurations:

```env
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here
```

The client will automatically load these values via the `dotenv` package.

---

## 🚀 Client Initialization

Import `ccxt` and instantiate the `zebpayfutures` class with your credentials:


```javascript
const ccxt = require('ccxt');
require('dotenv').config();

const exchangeId = 'zebpayfutures'; // Make sure this matches the 'id' in describe() [cite: 1]
const exchangeClass = ccxt[exchangeId];

const client = new exchangeClass({
  apiKey: process.env.API_KEY,
  secret: process.env.SECRET_KEY, // CCXT standard property name is 'secret'
  // Optional: Set request timeout (in milliseconds)
  // timeout: 30000,
  // Optional: Override base API URL if needed (e.g., for testing)
  // urls: {
  //   api: {
  //     public: 'https://your-test-url',
  //     private: 'https://your-test-url',
  //   }
  // }
});

console.log(`Initialized Zebpay Futures CCXT client (ID: ${client.id})`);
```

---

## 📡 Client Methods

The CCXT client exposes both public and private methods that mirror those of your native Node.js client.

### 🟢 Public Methods

| Method                      | Description                                      |
|-----------------------------|--------------------------------------------------|
| `fetchOrderBook(symbol)`    | Get order book (bids/asks) for a symbol          |
| `fetchTicker(symbol)`       | Retrieve 24-hour ticker information              |
| `fetchMarkets()`            | Retrieve market information and trading pairs    |
| `fetchSystemTime()`         | Retrieve the server time                         |
| `fetchSystemStatus()`       | Check the current system operational status      |
| `fetchTradingFee(symbol)`   | Get trading fee details for a symbol             |
| `fetchTradingFees()`        | Get fee details for all supported pairs          |

<br>

### 🔒 Private Methods

| Method                      | Description                                      |
|-----------------------------|--------------------------------------------------|
| `fetchBalance()`            | Fetch user wallet balances                       |
| `createOrder(orderParams)`  | Place a new order                                |
| `cancelOrder(cancelParams)` | Cancel an existing order                         |
| `fetchOrder(orderId)`       | Retrieve details for a specific order            |
| `fetchOpenOrders(symbol)`   | Fetch open orders for a specific symbol          |
| `addTPSLOrder(params)`      | Add take-profit and/or stop-loss orders          |
| `addMargin(params)`         | Add margin to an existing position               |
| `reduceMargin(params)`      | Reduce margin from an existing position          |
| `closePosition(params)`     | Close a trading position                         |
| `fetchPositions(params)`    | Retrieve current positions                       |
| `fetchUserLeverage(symbol)` | Get leverage settings for a specific market      |
| `setLeverage(leverage, symbol)` | Adjust leverage settings for a market         |

> **Tip:** For full details on method parameters and response types, refer to the [zebpayfutures ccxt documentation](https://docs.ccxt.com/#/exchanges/zebpayfutures).

---

## 🧪 Example Usage

Below is an example demonstrating how to retrieve system status, fetch balance, and create an order:

```javascript
const ccxt = require('ccxt');
require('dotenv').config(); // For loading API keys securely

const exchangeId = 'zebpayfutures'; // Exchange ID for CCXT
const exchangeClass = ccxt[exchangeId];

const client = new exchangeClass({
  apiKey: process.env.API_KEY,
  secret: process.env.SECRET_KEY, // zebpay apiKy and secret
});

(async () => {
  try {
    const exchange = new ZebpayFutures({
      apiKey: process.env.API_KEY,
      secret: process.env.SECRET_KEY,
      // Alternatively, use jwt: process.env.JWT_TOKEN,
    });

    // Fetch system status
    console.log("Fetching system status...");
    const status = await exchange.fetchSystemStatus();
    console.log("System Status:", status);

    // Fetch balance
    console.log("Fetching balance...");
    const balance = await exchange.fetchBalance();
    console.log("Wallet Balance:", balance);

    // Create an order example
    console.log("Placing an order...");
    const order = await exchange.createOrder({
      symbol: 'BTCUSDT',
      amount: 0.001,
      side: 'BUY',
      type: 'LIMIT',
      price: 30000,
      marginAsset: 'USDT'
    });
    console.log("Order Details:", order);

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
```

For additional examples and detailed usage of every method, please see the documentation in [examples/ccxt/module/action.md](../../examples/ccxt/module/action.md).

---

## 📌 Compatibility & Version

| Field             | Value                                      |
|-------------------|--------------------------------------------|
| Client Version    | v1.0.0                                     |
| CCXT Integration  | Pending approval under the identifier `zebpayfutures` |
| API Compatibility | Zebpay Futures REST API v1                 |
| Node.js Support   | 18+                                        |

---

## 🔗 Helpful Links
- [Zebpay Futures REST API Reference](https://dev-futuresbe.zebstage.com/api/docs)
- [ccxt GitHub Repository](https://github.com/ccxt/ccxt)
- [ccxt Zebpay Futures Official Documentation](https://docs.ccxt.com/#/exchanges/zebpayfutures)
- [Native Node.js Client Repository](https://github.com/zebpay/zebpay-api-references/tree/main/futures/rest-api/clients/http/node)
-  [ZebPay API GitHub Monorepo (Root)](https://github.com/zebpay/zebpay-api-references/)

---

Happy Trading!
