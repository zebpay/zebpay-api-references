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
{
  "data": [
    {
      "symbol": "ETH-INR",
      "timestamp": 1756811797291,
      "high": "407799",
      "low": "392286.99",
      "bid": "400195",
      "bidVolume": "0.002499",
      "ask": "405000",
      "askVolume": "0.1",
      "vwap": "0",
      "open": "406813.94",
      "close": "402597.5",
      "last": "402597.5",
      "previousClose": "0",
      "change": "-4216.44",
      "percentage": "-1.03",
      "average": "404705.72",
      "baseVolume": "2.505503",
      "quoteVolume": "1008709.24"
    },
    {
      "symbol": "BTC-INR",
      "timestamp": 1756811797291,
      "high": "10150000",
      "low": "9910110",
      "bid": "9993095.54",
      "bidVolume": "0.00002",
      "ask": "10148991",
      "askVolume": "0.00370431",
      "vwap": "0",
      "open": "9973120.745",
      "close": "10071043.27",
      "last": "10071043.27",
      "previousClose": "0",
      "change": "97922.525",
      "percentage": "0.98",
      "average": "10022082.0075",
      "baseVolume": "1.21646014",
      "quoteVolume": "12251022.7"
    }
  ],
  "statusCode": 200,
  "statusDescription": "Success"
}
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
  "data": {
    "symbol": "BTC-INR",
    "timestamp": 1756811917290,
    "high": "10150000",
    "low": "9910110",
    "bid": "9992481.39",
    "bidVolume": "0.00002",
    "ask": "9993095.54",
    "askVolume": "0.00092064",
    "vwap": "0",
    "open": "9973120.745",
    "close": "9992788.465",
    "last": "9992788.465",
    "previousClose": "0",
    "change": "19667.72",
    "percentage": "0.19",
    "average": "9982954.605",
    "baseVolume": "1.21648014",
    "quoteVolume": "12156028.71"
  },
  "statusCode": 200,
  "statusDescription": "Success"
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
  "data": {
    "nonce": 51549652,
    "bids": [
      ["9993095.54", "0.00002"],
      ["9992481.39", "0.00002"],
      ["9991742.34", "0.04908344"]
    ],
    "asks": [
      ["10148991", "0.00370431"],
      ["10149000", "0.02777496"],
      ["10149999.99", "0.00161724"]
    ],
    "timestamp": 1756811787
  },
  "statusCode": 200,
  "statusDescription": "Success"
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
  "data": {
    "symbol": "BTC-INR",
    "bidPrice": "9998143.3",
    "bidVolume": "0.06342168",
    "askPrice": "10148991",
    "askVolume": "0.00370431"
  },
  "statusCode": 200,
  "statusDescription": "Success"
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
{
  "data": [
    {
      "id": 51542092,
      "side": "buy",
      "amount": "0.000111",
      "price": "9984999",
      "timestamp": 1756726428825,
      "isBuyerMaker": false,
      "symbol": "BTC-INR"
    },
    {
      "id": 51542094,
      "side": "sell",
      "amount": "0.07814857",
      "price": "9961242.49",
      "timestamp": 1756727953799,
      "isBuyerMaker": true,
      "symbol": "BTC-INR"
    }
  ],
  "statusCode": 200,
  "statusDescription": "Success"
}
```

### Get Klines/Candlesticks
Get historical klines/candlesticks for a trading pair.

**Endpoint:** `GET /api/v2/market/klines`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |
| interval | string | Yes | Kline interval (1m, 5m, 15m, 1h, 4h, 1d) |
| startTime | number | Yes | Start time in milliseconds |
| endTime | number | Yes | End time in milliseconds |

**Response:**
```json
{
  "data": [
    [
      1756166400,       // Open time
      "10055227.245",   // Open
      "10285189",       // High
      "9900000",        // Low
      "10171612.425",   // Close
      "0.40875286",     // Volume
      1756252800        // Close time
    ],
    [
      1756252800,
      "10171612.425",
      "10300999.94",
      "9967040.83",
      "10140898.14",
      "0.32490633",
      1756339200
    ]
  ],
  "statusCode": 200,
  "statusDescription": "Success"
}
```

## System Status

### Get Service Status
Get the current system status.

**Endpoint:** `GET /api/v2/system/status`

**Response:**
```json
{
    "remarks": "",
    "status": "open"
}
```

### Get Server Time
Get the current server time.

**Endpoint:** `GET /api/v2/system/time`

**Response:**
```json
{
  "time": 1744361888858
}
```

## Exchange Information

### Get Trading Pairs
Get information about all available trading pairs.

**Endpoint:** `GET /api/v2/ex/exchangeInfo`

**Response:**
```json
{
  "data": {
    "timezone": "UTC",
    "serverTime": 1756812743248,
    "rateLimits": [],
    "exchangeFilters": [],
    "symbols": [
      {
        "symbol": "BTC-INR",
        "status": "Open",
        "baseAsset": "BTC",
        "quoteAsset": "INR",
        "pricePrecision": "2",
        "quantityPrecision": "8",
        "tickSz": "0.01",
        "lotSz": "0.00000001",
        "orderTypes": ["LIMIT", "STOP_LOSS_LIMIT", "MARKET"],
        "timeInForce": [],
        "makerFee": 0.45,
        "takerFee": 0.45
      },
      {
        "symbol": "ETH-USDT",
        "status": "Open",
        "baseAsset": "ETH",
        "quoteAsset": "USDT",
        "pricePrecision": "6",
        "quantityPrecision": "6",
        "tickSz": "0.00000001",
        "lotSz": "0.000001",
        "orderTypes": ["LIMIT", "STOP_LOSS_LIMIT"],
        "timeInForce": [],
        "makerFee": 0.45,
        "takerFee": 0.45
      }
    ]
  },
  "statusCode": 200,
  "statusDescription": "Success"
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
          "maxWithdraw": "1.81840316000000",
          "maxDeposit": "100.00000000",
          "needTag": "false",
          "chainId": "bitcoin",
          "AddressRegex": "^(bc1([ac-hj-np-z02-9]{25,62}|[ac-hj-np-z02-9]{59})|1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34})$"
        }
      ]
    },
    {
      "currency": "USDT",
      "name": "USDT",
      "fullName": "USDT",
      "precision": "6",
      "type": "crypto",
      "isDebitEnabled": false,
      "chains": [
        {
          "chainName": "TRON(TRC20)",
          "withdrawalMinSize": "9.440000",
          "depositMinSize": "0.00000100",
          "withdrawalFee": "8.00000000",
          "isWithdrawEnabled": "true",
          "isDepositEnabled": "true",
          "contractAddress": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          "withdrawPrecision": "6",
          "maxWithdraw": "200000.00000000000000",
          "maxDeposit": "10000000.00000000",
          "needTag": "false",
          "chainId": "tron",
          "AddressRegex": "^T[a-zA-Z0-9]{33}$"
        },
        {
          "chainName": "Ethereum(ERC20)",
          "withdrawalMinSize": "3.540000",
          "depositMinSize": "0.00000100",
          "withdrawalFee": "3.00000000",
          "isWithdrawEnabled": "true",
          "isDepositEnabled": "true",
          "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          "withdrawPrecision": "6",
          "maxWithdraw": "200000.00000000000000",
          "maxDeposit": "10000000.00000000",
          "needTag": "false",
          "chainId": "ethereum",
          "AddressRegex": "^0x[a-fA-F0-9]{40}$"
        }
      ]
    }
  ],
  "statusCode": 200,
  "statusDescription": "Success"
}
``` 