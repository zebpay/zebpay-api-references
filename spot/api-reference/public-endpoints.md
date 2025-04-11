# Public Endpoints

This document describes the public endpoints available in the Zebpay Spot API. These endpoints do not require authentication.

## Table of Contents
- [Market Data](#market-data)
- [System Status](#system-status)
- [Exchange Information](#exchange-information)

## Market Data

### Get All Tickers
Get 24-hour price and volume statistics for all trading pairs.

**Endpoint:** `GET /api/v2/market/allTickers`

**Response:**
```json
[
  {
    "symbol": "BTC-INR",
    "bestBid": "7172080.69",
    "bestBidQty": "0.15471",
    "bestAsk": "7198376.05",
    "bestAskQty": "0.00161248",
    "priceChange": "-97725.008776",
    "priceChangePercent": "-1.36",
    "high": "7300000",
    "low": "6965026.32",
    "vol": "0.17943873",
    "volValue": "1289432.45",
    "last": "7185662.41"
  },
]
```

### Get Ticker
Get 24-hour price and volume statistics for a specific trading pair.

**Endpoint:** `GET /api/v2/market/ticker`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol (e.g., BTC-INR) |

**Response:**
```json
{
  "symbol": "BTC-INR",
  "bestBid": "7172080.69",
  "bestBidQty": "0.15471",
  "bestAsk": "7198376.05",
  "bestAskQty": "0.00161248",
  "priceChange": "-97725.008776",
  "priceChangePercent": "-1.36",
  "high": "7300000",
  "low": "6965026.32",
  "vol": "0.17943873",
  "volValue": "1289432.45",
  "last": "7185662.41"
}
```

### Get Order Book
Get the current order book for a trading pair.

**Endpoint:** `GET /api/v2/market/orderbook`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |
| limit | number | No | Number of orders to return (default: 15) |

**Response:**
```json
{
  "bids": [
    ["5499000", "0.5"],
    ["5498000", "1.2"]
  ],
  "asks": [
    ["5501000", "0.3"],
    ["5502000", "0.8"]
  ]
}
```

### Get Order Book Ticker
Get the best bid/ask price and quantity for a trading pair.

**Endpoint:** `GET /api/v2/market/orderbook/ticker`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |

**Response:**
```json
{
  "symbol": "BTC-INR",
  "bidPrice": "5499000",
  "bidQty": "0.5",
  "askPrice": "5501000",
  "askQty": "0.3"
}
```

### Get Recent Trades
Get recent trades for a trading pair.

**Endpoint:** `GET /api/v2/market/trades`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |
| limit | number | No | Number of trades to return (default: 200) |
| page | number | No | Page number (default: 1) |

**Response:**
```json
[
  {
    "id": "123456",
    "price": "5500000",
    "quantity": "0.001",
    "time": "1612345678",
    "isBuyerMaker": true
  }
]
```

### Get Klines/Candlesticks
Get historical klines/candlesticks for a trading pair.

**Endpoint:** `GET /api/v2/market/klines`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |
| interval | string | Yes | Kline interval (1m, 5m, 15m, 1h, 4h, 1d) |
| startTime | number | No | Start time in milliseconds |
| endTime | number | No | End time in milliseconds |

**Response:**
```json
[
  [
    1612345678000,  // Open time
    "5500000",      // Open
    "5600000",      // High
    "5400000",      // Low
    "5550000",      // Close
    "10.5",         // Volume
    1612345738000,  // Close time
    "57750000",     // Quote volume
    100,            // Number of trades
    "5.5",          // Taker buy base volume
    "30250000"      // Taker buy quote volume
  ]
]
```

## System Status

### Get Service Status
Get the current system status.

**Endpoint:** `GET /api/v2/status`

**Response:**
```json
{
    "remarks": "",
    "status": "open"
}
```

### Get Server Time
Get the current server time.

**Endpoint:** `GET /api/v2/time`

**Response:**
```json
{
  "time": 1744361888858
}
```

## Exchange Information

### Get Trading Pairs
Get information about all available trading pairs.

**Endpoint:** `GET /api/v2/ex/tradepairs`

**Response:**
```json
{
  "data": {
    "tradePairs": [
      {
        "symbol": "BTC-INR",
        "name": "BTC-INR",
        "baseCurrency": "BTC",
        "quoteCurrency": "INR",
        "feeCurrency": "INR",
        "baseMinSize": "",
        "quoteMinSize": "100",
        "baseMaxSize": "",
        "quoteMaxSize": "10000000",
        "baseIncrement": "0.00000001",
        "quoteIncrement": "0.01",
        "priceIncrement": 0.01,
        "enableTrading": true
      }
    ]
  },
  "statusCode": 200,
  "statusDescription": "Success",
}
```

### Get Coin Settings
Get information about all available currencies.

**Endpoint:** `GET /api/v2/ex/currencies`

**Response:**
```json
{
  "data": [
    {
      "currency": "BTC",
      "name": "BTC",
      "fullName": "Bitcoin",
      "precision": "8",
      "type": "crypto",
      "isDebitEnabled": false,
      "chains": [
          {
              "chainName": "Bitcoin",
              "withdrawalMinSize": "0.000482",
              "depositMinSize": "0.00000001",
              "withdrawalFee": "0.00040000",
              "isWithdrawEnabled": "true",
              "isDepositEnabled": "true",
              "contractAddress": "",
              "withdrawPrecision": "8",
              "maxWithdraw": "2.45060379000000",
              "maxDeposit": "100.00000000",
              "needTag": "false",
              "chainId": "bitcoin",
              "AddressRegex": "^(bc1([ac-hj-np-z02-9]{25,62}|[ac-hj-np-z02-9]{59})|1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34})$"
          }
      ]
    }
  ],
  "statusCode": 200,
  "statusDescription": "Success",
}
``` 