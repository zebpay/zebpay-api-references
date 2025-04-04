
# 📘 Futures API JavaScript Client

![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)  ![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📑 Table of Contents

1. [🧭 Overview](#-overview)
2. [⚡ Quickstart](#-quickstart)
3. [⚙️ Installation and Setup](#-installation-and-setup)
4. [🔐 Authentication Setup](#-authentication-setup)
5. [🚀 Client Initialization](#-client-initialization)
6. [📡 Client Methods](#-client-methods)
   - [🟢 Public Methods (No Authentication Required)](#-public-methods-no-authentication-required)
   - [🔒 Private Methods (Authentication Required)](#-private-methods-authentication-required)
7. [🧪 Example Usage](#-example-usage)
8. [📦 API Response Structure](#-api-response-structure)
9. [🧯 Error Handling](#-error-handling)
10. [🗂️ Project Structure](#-project-structure)
11. [📌 Compatibility & Version](#-compatibility--version)
12. [🔗 Helpful Links](#-helpful-links)

---

## 🧭 Overview

The **Futures API JavaScript Client** provides a streamlined, intuitive interface to interact with the ZebPay Futures REST API.

This client handles:
- ✅ Secure authentication (JWT or API Key/Secret)
- 📡 Simplified REST calls to public and private endpoints
- 🛠️ Signature generation and error handling

Focus on writing your **strategies**, **analytics**, or **integrations** — we handle the boilerplate.

---

## ⚡ Quickstart

Once installed and authenticated, you're one line away from live data:

```javascript
const FuturesApiClient = require('./client');
const client = new FuturesApiClient({ jwt: 'your_token' });
console.log(await client.getMarketInfo());
```

Dive deeper into [📡 Client Methods](#-client-methods) for full capabilities.

---

## ⚙️ Installation and Setup

### Prerequisites

- Node.js 18 or newer

### Install Dependencies

> 💡 **Tip**: It's recommended (though not required) to use a [node version manager](https://github.com/nvm-sh/nvm) to manage your local versions and avoid conflicts.

```bash
npm install
```

---

## 🔐 Authentication Setup

Create a `.env` file in your project root with one of the following options:

```env
# --- Option 1: JWT Authentication ---
JWT_TOKEN=your_jwt_token_here

# --- Option 2: API Key + Secret Authentication ---
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here
```

The `dotenv` package is used to load these into the environment automatically.

---

## 🚀 Client Initialization

> `timeout` is optional (default: 30 seconds).

### 🛡️ Using JWT Authentication

```javascript
const FuturesApiClient = require('./client');
require('dotenv').config();

const client = new FuturesApiClient({
  jwt: process.env.JWT_TOKEN
});
```

### 🔑 Using API Key + Secret

```javascript
const FuturesApiClient = require('./client');
require('dotenv').config();

const client = new FuturesApiClient({
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY
});
```

---

## 📡 Client Methods

### 🟢 Public Methods (No Authentication Required)

| Method | Description |
|--------|-------------|
| `getOrderBook(symbol)` | Get order book (bids/asks) for a symbol |
| `getTicker24Hr(symbol)` | 24-hour price stats |
| `getMarketInfo()` | Market status and metrics |
| `getAggTrade(symbol)` | Recent aggregated trades |
| `getSystemTime()` | API server time |
| `getSystemStatus()` | System operational status |
| `getTradeFee(symbol)` | Fee info for one symbol |
| `getTradeFees()` | All trading fees |
| `getExchangeInfo()` | All trading pairs, limits, rules |
| `getPairs()` | Trading pair details |

<br>

### 🔒 Private Methods (Authentication Required)

| Method | Description |
|--------|-------------|
| `getBalance()` | Wallet balances for all assets |
| `createOrder(orderParams)` | Place a new order. Required fields: `symbol`, `amount`, `side`, `type`, `marginAsset`, and optionally `price` (for LIMIT orders) |
| `cancelOrder(cancelParams)` | Cancel order by `clientOrderId` |
| `getOrder(clientOrderId)` | Get order details |
| `getOpenOrders(symbol, limit, since)` | Open orders for a symbol |
| `getOrderHistory(pageSize, timestamp)` | Historical orders |
| `getTradeHistory(pageSize, timestamp)` | Historical trades |
| `getTransactionHistory(pageSize, timestamp)` | Wallet activity (deposits, withdrawals, fees) |
| `addTPSLOrder(tpslParams)` | Add take-profit / stop-loss |
| `addMargin(marginParams)` | Add margin to position |
| `reduceMargin(marginParams)` | Reduce margin from position |
| `closePosition(closeParams)` | Close position by `positionId` |
| `getPositions(symbols, status)` | Filter by symbols and status (OPEN/CLOSED) |
| `getUserLeverage(symbol)` | Leverage for a symbol |
| `getUserLeverages()` | All user leverages |
| `updateLeverage(leverageParams)` | Set leverage for a symbol |

<br>

### 📄 Explore Full Method Signatures & Typings

For full argument details and return types, refer to:

- [`client.js`](./client.js)
- [`types.js`](./utils/types.js)

These files define all accepted fields and structured responses via JSDoc typedefs.

---

## 🧪 Example Usage

```javascript
  try {
    console.log("Fetching system status...");
    const status = await client.getSystemStatus();
    if ([200, 201].includes(status.statusCode)) {
      console.log("System Status:", status.data);
    } else {
      console.log("Failed to fetch system status:", status.statusDescription);
    }

    console.log("\nFetching balance...");
    const balance = await client.getBalance();

    if ([200, 201].includes(balance.statusCode)) {
      console.log("Account Balances:", balance.data);
    } else {
      console.log("Failed to fetch account balance:", balance.statusDescription);
    }

  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
```

---

## 📦 API Response Structure

All responses follow this structure:

```javascript
{
  statusDescription: "Success",
  data: { ... } or [ ... ],   // Can be object or array depending on endpoint
  statusCode: 200,
  customMessage: ["OK"]
}
```

### ✅ Best Practice:
Check for success with:
```javascript
if ([200, 201].includes(response.statusCode)) {
  // Handle success
}
```

---

## 🧯 Error Handling

| Error | Cause |
|----------|-------|
| `Error('{Parameter} is required')` | Required method parameter is not provided |
| `Error('Request Error: ...')` | No response received from server |
| `Error('API Error: ...')` | API returned a non-2xx status code |
| `Error('Request Setup Error: ...')` | Issue in building the request or misconfiguration |

> Wrap all API calls in `try/catch` to gracefully handle failures.

---

## 🗂️ Project Structure

> Located at: `futures/clients/rest-http/javascript`

```
.
├── client.js                  # Main FuturesApiClient class and methods
├── run.example.js             # Usage demo for testing the client
├── .env.example               # Sample .env file for authentication
├── utils/
│   ├── auth.js                # Handles JWT and API key auth headers/signatures
│   ├── config.js              # API base URL and endpoint paths
│   └── types.js               # JSDoc-style typedefs for structured response types
├── package.json               # Project metadata and dependencies
└── README.md                  # Documentation
```

---

## 📌 Compatibility & Version

| Field | Value |
|-------|-------|
| Client Version | v1.0.0 |
| API Compatibility | ZebPay Futures REST API v1 |
| Node.js Support | 18+ |

---

## 🔗 Helpful Links

- 📘 [Futures REST API Reference (Swagger/OpenAPI)](https://dev-futuresbe.zebstage.com/api/docs)
- 🛠 [Submit an Issue](https://github.com/zebpay/zebpay-api-references/issues)
- 🧪 [Node.js Client Code](https://github.com/zebpay/zebpay-api-references/tree/main/futures/clients/rest-http/node)
- 🗃️ [ZebPay API GitHub Monorepo (Root)](https://github.com/zebpay/zebpay-api-references/)

---
