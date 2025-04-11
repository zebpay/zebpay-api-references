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
    "price": "5500000",
    "priceChange": "100000",
    "priceChangePercent": "1.85",
    "high": "5600000",
    "low": "5400000",
    "volume": "10.5",
    "quoteVolume": "57750000",
    "lastPrice": "5500000",
    "bidPrice": "5499000",
    "askPrice": "5501000"
  }
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
  "price": "5500000",
  "priceChange": "100000",
  "priceChangePercent": "1.85",
  "high": "5600000",
  "low": "5400000",
  "volume": "10.5",
  "quoteVolume": "57750000",
  "lastPrice": "5500000",
  "bidPrice": "5499000",
  "askPrice": "5501000"
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
  "status": "normal",
  "message": "System is operating normally"
}
```

### Get Server Time
Get the current server time.

**Endpoint:** `GET /api/v2/time`

**Response:**
```json
{
  "serverTime": 1612345678000
}
```

## Exchange Information

### Get Trading Pairs
Get information about all available trading pairs.

**Endpoint:** `GET /api/v2/ex/tradepairs`

**Response:**
```json
{
  "timezone": "UTC",
  "serverTime": 1612345678000,
  "symbols": [
    {
      "symbol": "BTC-INR",
      "status": "TRADING",
      "baseAsset": "BTC",
      "quoteAsset": "INR",
      "minPrice": "0.000001",
      "maxPrice": "100000000",
      "tickSize": "0.000001",
      "minQty": "0.000001",
      "maxQty": "100000000",
      "stepSize": "0.000001",
      "minNotional": "100"
    }
  ]
}
```

### Get Coin Settings
Get information about all available currencies.

**Endpoint:** `GET /api/v2/ex/currencies`

**Response:**
```json
[
  {
    "currency": "BTC",
    "name": "Bitcoin",
    "status": "TRADING",
    "minWithdraw": "0.001",
    "maxWithdraw": "100",
    "withdrawFee": "0.0005"
  }
]
``` 