# 📘 Futures API Python Client

![Python version](https://img.shields.io/badge/python-3.9%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

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
11. [📌 Compatibility & Version](#compatibility-version)
12. [🔗 Helpful Links](#-helpful-links)

---

## 🧭 Overview

The **Futures API Python Client** provides a streamlined, intuitive interface to interact with the ZebPay Futures REST API.

This client handles:
- ✅ Secure authentication (JWT or API Key/Secret)
- 📡 Simplified REST calls to public and private endpoints
- 🛠️ Signature generation and error handling

Focus on writing your **strategies**, **analytics**, or **integrations** — we handle the boilerplate.

---

## ⚡ Quickstart

Public market data does not require authentication:

```python
from client.client import FuturesApiClient
client = FuturesApiClient()
print(client.get_market_info())
```

Dive deeper into [📡 Client Methods](#-client-methods) for full capabilities.

---

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.9 or newer

### Install Dependencies

> 💡 **Tip**: It's recommended (though not required) to use a [virtual environment](https://docs.python.org/3/library/venv.html) to avoid dependency conflicts with system-wide packages.

```bash
pip install -r requirements.txt
```

Run request-signing, validation, and local HTTP transport tests with:

```bash
python -m unittest discover -s tests
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

The `python-dotenv` package is used to load these into the environment automatically.

API-key REST reads require `fetch:details` or `futures:trading`; REST writes require `futures:trading`. The client adds and signs a millisecond timestamp automatically.

Authentication is optional for public methods. Private methods require either JWT or API-key credentials, never both.

---

## 🚀 Client Initialization

> `timeout` is optional (default: 30 seconds).

### Public Methods Only

```python
from client.client import FuturesApiClient
client = FuturesApiClient()
```

### 🛡️ Using JWT Authentication

```python
from client.client import FuturesApiClient
from dotenv import load_dotenv
import os

load_dotenv()

client = FuturesApiClient(
    jwt=os.getenv("JWT_TOKEN")
)
```

### 🔑 Using API Key + Secret

```python
from client.client import FuturesApiClient
from dotenv import load_dotenv
import os

load_dotenv()

client = FuturesApiClient(
    api_key=os.getenv("API_KEY"),
    secret_key=os.getenv("SECRET_KEY"),
    # Optional:
    subaccount_id=os.getenv("SUBACCOUNT_ID")
)
```

---

## 📡 Client Methods

### 🟢 Public Methods (No Authentication Required)

| Method | Description |
|--------|-------------|
| `fetch_markets()` | Get all available markets |
| `get_order_book(symbol)` | Get order book (bids/asks) for a symbol |
| `get_ticker_24hr(symbol)` | 24-hour price stats |
| `get_market_info()` | Market status and metrics |
| `get_agg_trade(symbol)` | Recent aggregated trades |
| `get_klines(kline_params)` | Fetch OHLCV candles |
| `get_system_time()` | API server time |
| `get_system_status()` | System operational status |
| `get_trade_fee(symbol)` | Fee info for one symbol |
| `get_trade_fees()` | All trading fees |
| `get_exchange_info()` | All trading pairs, limits, rules |
| `get_pairs()` | Trading pair details |

<br>

### 🔒 Private Methods (Authentication Required)

| Method | Description |
|--------|-------------|
| `get_balance()` | Wallet balances for all assets |
| `create_order(order_params)` | Place `MARKET`, `LIMIT`, `STOP_MARKET`, or `STOP_LIMIT`. `marginAsset` is optional; stop orders require `triggerPrice` |
| `cancel_order(cancel_params)` | Cancel order by `clientOrderId` |
| `cancel_all_orders()` | Cancel all open orders |
| `edit_order(order_params)` | Edit an open order |
| `get_order(client_order_id)` | Get order details |
| `get_open_orders(symbol, limit=None, since=None)` | Open orders for a symbol |
| `get_order_history(page_size=None, timestamp=None)` | Historical orders |
| `get_trade_history(page_size=None, timestamp=None)` | Historical trades |
| `get_transaction_history(page_size=None, timestamp=None)` | Wallet activity (deposits, withdrawals, fees) |
| `add_tpsl_order(tpsl_params)` | Add one take-profit or stop-loss; requires `symbol` and exactly one trigger |
| `add_margin(margin_params)` | Add margin to position |
| `reduce_margin(margin_params)` | Reduce margin from position |
| `close_position(close_params)` | Close position by `positionId` |
| `get_positions(symbols=None, status=None)` | Filter by symbols and status (OPEN/CLOSED) |
| `get_user_leverage(symbol)` | Leverage for a symbol |
| `get_user_leverages()` | All user leverages |
| `update_leverage(leverage_params)` | Set leverage for a symbol |

<br>

### 📄 Explore Full Method Signatures & Typings

For full argument details and return types, refer to:

- [`client.py`](https://github.com/zebpay/zebpay-api-references/blob/main/futures/clients/rest-http/python/client/client.py)
- [`types.py`](https://github.com/zebpay/zebpay-api-references/blob/main/futures/clients/rest-http/python/utils/types.py)

These files define all accepted fields and structured responses via `TypedDict`s.

---

## 🧪 Example Usage

```python
try:
    print("Fetching system status...")
    status = client.get_system_status()
    if status.get("statusCode") in [200, 201]:
        print("System Status:", status["data"])
    else:
        print("Failed to fetch system status:", status.get("statusDescription"))

    print("\nFetching balance...")
    balance = client.get_balance()
    if balance.get("statusCode") in [200, 201]:
        print("Account Balances:", balance["data"])
    else:
        print("Failed to fetch account balance:", balance.get("statusDescription"))

except Exception as e:
    print(f"Error: {str(e)}")
```

---

## 📦 API Response Structure

All responses follow this structure:

```python
{
  "statusDescription": "Success",
  "data": { ... } or [ ... ],   # Can be object or array depending on endpoint
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

### ✅ Best Practice:
Check for success with:
```python
if response.get("statusCode") in [200, 201]:
    # Handle success
```

---

## 🧯 Error Handling

| Exception | Cause |
|----------|-------|
| `ValueError` | Missing or invalid input parameters |
| `TimeoutError` | API response timeout |
| `ConnectionError` | Network issues or HTTP error from server |

> Wrap all API calls in `try...except` to gracefully handle failures.

---

## 🗂️ Project Structure

> Located at: [`futures/clients/rest-http/python`](https://github.com/zebpay/zebpay-api-references/tree/main/futures/clients/rest-http/python)

```
python/
├── client/
│   ├── __init__.py               # Marks client module
│   └── client.py                 # Main FuturesApiClient class and methods
│
├── utils/
│   ├── __init__.py               # Marks utils module
│   ├── auth.py                   # Handles JWT and API key auth headers/signatures
│   ├── config.py                 # API base URL and endpoint paths
│   └── types.py                  # TypedDicts for structured response types
│
├── run_example.py                # Usage demo for testing the client
├── requirements.txt              # Dependency list
└── .env.example                  # Sample .env file for authentication
```

---

<a id="compatibility-version"></a>
## 📌 Compatibility & Version

| Field | Value |
|-------|-------|
| Client Version | v1.0.0 |
| API Compatibility | ZebPay Futures REST API v1 |
| Python Support | 3.9+ |

---

## 🔗 Helpful Links

- 📘 [Futures REST API Reference (Swagger/OpenAPI)](https://dev-futuresbe.zebstage.com/api/docs)
- 🛠 [Submit an Issue](https://github.com/zebpay/zebpay-api-references/issues)
- 🧪 [Python Client Code](https://github.com/zebpay/zebpay-api-references/tree/main/futures/clients/rest-http/python)
- 🗃️ [ZebPay API GitHub Monorepo (Root)](https://github.com/zebpay/zebpay-api-references/)

---
