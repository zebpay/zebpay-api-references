# API Reference: Public Market Endpoints

These endpoints provide public access to market data such as order books, price tickers, and recent trades. **Authentication is not required.**

---

---

### Fetch Markets

Retrieves details about all available trading symbols (markets), including their status, precision, fees, and leverage limits.

#### Request

| Attribute         | Value                      |
|-------------------|----------------------------|
| **HTTP Method** | `GET`                      |
| **Endpoint Path** | `/api/v1/market/markets`  |
| **Auth Required** | No                         |
| **Query Params** | None                       |
| **Request Body** | N/A                        |

#### Success Response

| Status Code | Description        |
|-------------|--------------------|
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([MarketsData](../data-models.md#marketsdata) object):
- Includes timezone, server time, rate limits, and a list of symbol details.

##### Example (`data` field content)

```js
{
  "timezone": "UTC",
  "serverTime": 1744364554387,
  "rateLimits": [],
  "exchangeFilters": [],
  "symbols": [
    {
      "symbol": "1000PEPEINR",
      "status": "Open",
      "maintMarginPercent": "15",
      "requiredMarginPercent": "0",
      "baseAsset": "1000PEPE",
      "quoteAsset": "INR",
      "pricePrecision": 5,
      "quantityPrecision": 0,
      "baseAssetPrecision": 0,
      "quotePrecision": 0,
      "orderTypes": [ "LIMIT", "MARKET" ],
      "timeInForce": [ "GTC" ],
      "makerFee": 0.05,
      "takerFee": 0.1,
      "minLeverage": 1,
      "maxLeverage": 10
    },
    {
      "symbol": "XRPINR",
      "status": "Open",
      "maintMarginPercent": "15",
      "requiredMarginPercent": "0",
      "baseAsset": "XRP",
      "quoteAsset": "INR",
      "pricePrecision": 2,
      "quantityPrecision": 1,
      // ... other fields ...
      "makerFee": 0.05,
      "takerFee": 0.1,
      "minLeverage": 1,
      "maxLeverage": 20
    }
    // ... other symbols
  ]
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### Get Order Book

Retrieves the current order book (bids and asks) for a specific trading symbol.

#### Request

| Attribute         | Value                        |
|-------------------|------------------------------|
| **HTTP Method**   | `GET`                        |
| **Endpoint Path** | `/api/v1/market/orderBook`   |
| **Auth Required** | No                           |
| **Query Params**  | `symbol` (string, required)  |
| **Request Body**  | N/A                          |

#### Success Response

| Status Code | Description        |
|-------------|--------------------|
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([OrderBook](../../data-models.md#orderbook) object):
- Includes arrays of bids and asks with price/quantity pairs.

##### Example (`data` field content)

```json
{
  "symbol": "BTCUSDT",
  "bids": [
    [65000.50, 0.5],
    [65000.10, 1.2],
    [64999.80, 0.8]
  ],
  "asks": [
    [65001.00, 0.3],
    [65001.50, 1.0],
    [65002.00, 0.7]
  ],
  "timestamp": 1712345678901,
  "datetime": "2025-04-05T11:59:38.901Z",
  "nonce": 123456789
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### Get 24hr Ticker

Retrieves price change statistics for a specific trading symbol over the last 24 hours.

#### Request

| Attribute         | Value                          |
|-------------------|---------------------------------|
| **HTTP Method**   | `GET`                          |
| **Endpoint Path** | `/api/v1/market/ticker24Hr`    |
| **Auth Required** | No                             |
| **Query Params**  | `symbol` (string, required)    |
| **Request Body**  | N/A                            |

#### Success Response

| Status Code | Description        |
|-------------|--------------------|
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([Ticker](../../data-models.md#ticker) object):
24-hour statistics including price change, high/low, volume, etc.

##### Example (`data` field content)

```json
{
  "symbol": "BTCUSDT",
  "info": {
    "eventTimestamp": 1712345678905,
    "symbol": "BTCUSDT",
    "priceChange": "150.50",
    "priceChangePercentage": "0.23",
    "weightedAveragePrice": "65100.00",
    "lastPrice": "65150.50",
    "lastQuantityTraded": "0.01",
    "openPrice": "65000.00",
    "highestPrice": "65500.00",
    "lowestPrice": "64800.00",
    "totalTradedVolume": "1500.50",
    "totalTradedQuoteAssetVolume": "97682775.00",
    "startTime": 1712259278905,
    "endTime": 1712345678905,
    "firstTradeId": 987000,
    "lastTradeId": 989500,
    "numberOfTrades": 2501
  },
  "timestamp": 1712345678905,
  "datetime": "2025-04-05T11:59:38.905Z",
  "high": 65500.00,
  "low": 64800.00,
  "vwap": 65100.00,
  "open": 65000.00,
  "close": 65150.50,
  "last": 65150.50,
  "change": 150.50,
  "percentage": 0.23,
  "average": 65075.25,
  "baseVolume": 1500.50,
  "quoteVolume": 97682775.00
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### Get Market Info

Retrieves high-level market information, potentially including metrics for multiple symbols.

#### Request

| Attribute         | Value                          |
|-------------------|---------------------------------|
| **HTTP Method**   | `GET`                          |
| **Endpoint Path** | `/api/v1/market/marketInfo`    |
| **Auth Required** | No                             |
| **Query Params**  | None                           |
| **Request Body**  | N/A                            |

#### Success Response

| Status Code | Description        |
|-------------|--------------------|
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** (object):
A mapping of symbols to their respective [MarketInfo](../../data-models.md#marketinfo) objects.

##### Example (`data` field content)

```json
{
  "BTCUSDT": {
    "lastPrice": "65150.50",
    "marketPrice": "65150.00",
    "priceChangePercent": "0.23",
    "baseAssetVolume": "1500.50"
  },
  "ETHUSDT": {
    "lastPrice": "3300.10",
    "marketPrice": "3300.00",
    "priceChangePercent": "1.50",
    "baseAssetVolume": "25000.75"
  }
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### Get Aggregate Trades

Retrieves recent aggregate trades for a specific trading symbol.

#### Request

| Attribute         | Value                          |
|-------------------|---------------------------------|
| **HTTP Method**   | `GET`                          |
| **Endpoint Path** | `/api/v1/market/aggTrade`      |
| **Auth Required** | No                             |
| **Query Params**  | `symbol` (string, required)    |
| **Request Body**  | N/A                            |

#### Success Response

| Status Code | Description        |
|-------------|--------------------|
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** (Array<[AggregateTrade](../../data-models.md#aggregatetrade)> objects):
A list of recent aggregate trades.

##### Example (`data` field content — single item shown)

```json
[
  {
    "aggregateTradeId": 543210,
    "symbol": "BTCINR",
    "price": "5500000.00",
    "quantity": "0.005",
    "firstTradeId": 98765,
    "lastTradeId": 98767,
    "tradeTime": 1712345000123,
    "isBuyerMarketMaker": false
  }
]
```

> See [Error Response Structure]((../error-handling.md)) for error formats.

---

### <a id="get-klines"> Get K-Lines (OHLCV Data)

Retrieves historical candlestick data (Open, High, Low, Close, Volume) for a specified trading symbol and timeframe.

-   **Endpoint:** `POST /api/v1/market/klines`
-   **Method:** `POST`
-   **Handler:** `getKlines`

**Request Body**

The body must be a JSON object specifying the parameters for the k-line data.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `symbol` | string | Yes | The trading pair symbol (e.g., 'BTCINR'). |
| `interval` | string | Yes | The candlestick interval (e.g., '1m', '5m', '1h', '1d'). |
| `startTime` | number | No | The start time in milliseconds to fetch data from. |
| `endTime` | number | No | The end time in milliseconds to fetch data up to. |
| `limit` | number | No | The maximum number of data points to return (Default is 500, max is 1000). |

**Example Request:**

```json
{
    "symbol": "BTCINR",
    "interval": "1h",
    "limit": 100
}
```

**Successful Response (200 OK)**

Returns an array of k-line data points. Each k-line is a sub-array containing `[open, high, low, close, volume]`.

**Example Response:**

```json
{
    "data": [
      "5500000",  //open
      "5600000",  //high,
      "5400000",  //low
      "5550000",  //close
      "10.5",     //volume
    ]
}
```

---
