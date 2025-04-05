# Data Models

This section describes the common JSON data structures returned by the API. Understanding these models is key to interpreting the results from API calls. All definitions are based on the structures indicated in the client libraries.
---

# 📘 Table of Contents

### 📦 General Response Wrappers
- [`ApiResponse<T>`](#apiresponse)

### 📈 Market Models
- [`OrderBook`](#orderbook)
- [`Ticker`](#ticker)
- [`MarketInfo`](#marketinfo)
- [`AggregateTrade`](#aggregatetrade)

### 💰 Wallet Models
- [`WalletBalance`](#walletbalance)
- [`AssetBalance`](#assetbalance)

### 📄 Order & Trade Models
- [`Order`](#order)
- [`Position`](#position)
- [`Leverage`](#leverage)
- [`Trade`](#trade)
- [`Transaction`](#transaction)

### ⚙️ Exchange Metadata
- [`ExchangeInfo`](#exchangeinfo)
- [`PairsInfo`](#pairsinfo)

### 🔁 Action Response Models
- [`CreateOrderResponseData`](#createorderresponsedata)
- [`AddTPSLResponseData`](#addtpslresponsedata)
- [`ClosePositionResponseData`](#closepositionresponsedata)
- [`CancelOrderResponseData`](#cancelorderresponsedata)
- [`MarginResponse`](#marginresponse)

### 📄 Paginated List Response Models
- [`OrdersListResponse`](#orderslistresponse)
- [`TradesListResponse`](#tradeslistresponse)
- [`TransactionsListResponse`](#transactionslistresponse)

### 🚨 Error Handling
- [`Error Response Structure`](#errorresponse)

---

<a id="apiresponse"></a>
## `ApiResponse<T>`

This is the standard wrapper structure for most successful API responses. The actual data payload specific to the endpoint is contained within the `data` field.

**Fields:**

| Field Name         | Type             | Description                                                                 |
|--------------------|------------------|-----------------------------------------------------------------------------|
| `statusDescription`| `string`         | Human-readable status description (e.g., "Success").                        |
| `data`             | `T`              | The core response data payload. Its structure varies (see specific models below). |
| `statusCode`       | `number`         | The HTTP status code returned by the API (e.g., 200, 201).                  |
| `customMessage`    | `Array<string>`  | Additional informational messages from the API.                           |

##### Example (Generic Structure)

```js
{
  "statusDescription": "Success",
  "data": {
    // Specific data structure depends on the endpoint called
    // See examples for OrderBook, Ticker, etc., below
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

---

<a id="orderbook"></a>
## `OrderBook`

Represents the market depth for a trading pair, returned within the `data` field of `GET /api/v1/market/orderBook`.

**Fields:**

| Field Name | Type                      | Description                                                      |
|------------|---------------------------|------------------------------------------------------------------|
| `symbol`   | `string`                  | Trading pair symbol (e.g., "BTCUSDT").                           |
| `bids`     | `Array<[number, number]>` | Array of buy orders `[price, amount]`, sorted by price descending.|
| `asks`     | `Array<[number, number]>` | Array of sell orders `[price, amount]`, sorted by price ascending.|
| `timestamp`| `number` \| `null`        | Unix timestamp (ms) when the order book was generated.           |
| `datetime` | `string` \| `null`        | ISO8601 formatted datetime string.                               |
| `nonce`    | `number` \| `null`        | Exchange-provided sequence number, if available.                 |

##### Example (`data` field content)

```js
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

---

<a id="ticker"></a>
## `Ticker`

Represents 24-hour market statistics for a trading pair, returned within the `data` field of `GET /api/v1/market/ticker24Hr`.

**Fields:**

| Field Name   | Type     | Description                                                     |
|--------------|----------|-----------------------------------------------------------------|
| `symbol`     | `string` | Trading pair symbol.                                              |
| `info`       | `object` | Raw ticker data object from the exchange (see description below). |
| `timestamp`  | `number` | Unix timestamp in milliseconds.                                  |
| `datetime`   | `string` | ISO8601 formatted datetime string.                                |
| `high`       | `number` | Highest price in the 24-hour period.                              |
| `low`        | `number` | Lowest price in the 24-hour period.                               |
| `vwap`       | `number` | Volume-weighted average price.                                    |
| `open`       | `number` | Opening price.                                                    |
| `close`      | `number` | Closing price (last price).                                       |
| `last`       | `number` | Last traded price.                                                |
| `change`     | `number` | Price change in the period.                                       |
| `percentage` | `number` | Price change percentage.                                          |
| `average`    | `number` | Average price.                                                    |
| `baseVolume` | `number` | Trading volume in the base asset.                                 |
| `quoteVolume`| `number` | Trading volume in the quote asset.                                |

**`info` Object Fields (Common Examples):**

| Field Name                    | Type     | Description                                      |
|-------------------------------|----------|--------------------------------------------------|
| `eventTimestamp`              | `number` | Event timestamp in milliseconds.                 |
| `priceChange`                 | `string` | Price change as a string.                        |
| `priceChangePercentage`       | `string` | Price change percentage as a string.             |
| `weightedAveragePrice`        | `string` | Volume-weighted average price as a string.       |
| `lastPrice`                   | `string` | Last traded price as a string.                   |
| `lastQuantityTraded`          | `string` | Last traded quantity as a string.                |
| `openPrice`                   | `string` | Opening price as a string.                       |
| `highestPrice`                | `string` | Highest price in 24h as a string.                |
| `lowestPrice`                 | `string` | Lowest price in 24h as a string.                 |
| `totalTradedVolume`           | `string` | Total volume (base asset) as a string.           |
| `totalTradedQuoteAssetVolume` | `string` | Total volume (quote asset) as a string.          |
| `startTime`                   | `number` | Period start time (ms).                          |
| `endTime`                     | `number` | Period end time (ms).                            |
| `firstTradeId`                | `number` | First trade ID in the period.                    |
| `lastTradeId`                 | `number` | Last trade ID in the period.                     |
| `numberOfTrades`              | `number` | Total number of trades in the period.            |

##### Example (`data` field content)

```js
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

---

<a id="marketinfo"></a>
## `MarketInfo`

Represents high-level market information for a trading pair, potentially returned by `GET /api/v1/market/marketInfo`. The `data` field often contains an object mapping symbols to these structures.

**Fields:**

| Field Name           | Type     | Description                     |
|----------------------|----------|---------------------------------|
| `lastPrice`          | `string` | Last traded price.              |
| `marketPrice`        | `string` | Current market price.           |
| `priceChangePercent` | `string` | Price change percentage.        |
| `baseAssetVolume`    | `string` | Trading volume in base asset.   |

##### Example (`data` field content - assuming map structure)

```js
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

---

<a id="aggregatetrade"></a>
## `AggregateTrade`

Represents combined trades at the same price level, returned as an array within the `data` field of `GET /api/v1/market/aggTrade`.

**Fields:**

| Field Name           | Type      | Description                                                     |
|----------------------|-----------|-----------------------------------------------------------------|
| `aggregateTradeId`   | `number`  | Unique identifier for the aggregate trade.                      |
| `symbol`             | `string`  | Trading pair symbol.                                            |
| `price`              | `string`  | Trade price.                                                    |
| `quantity`           | `string`  | Trade quantity.                                                 |
| `firstTradeId`       | `number`  | ID of the first trade included in the aggregate.                |
| `lastTradeId`        | `number`  | ID of the last trade included in the aggregate.                 |
| `tradeTime`          | `number`  | Timestamp of the trade in milliseconds.                         |
| `isBuyerMarketMaker` | `boolean` | Whether the buyer was the market maker.                         |

##### Example (Single element in the `data` array)

```js
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
```

---

<a id="walletbalance"></a>
## `WalletBalance`

Represents the user's wallet balances, returned within the `data` field of `GET /api/v1/wallet/balance`. It's typically an object mapping asset symbols to `AssetBalance` objects.

**Structure:**
- Keys are asset symbols (`string`, e.g., "USDT", "BTC").
- Values are [AssetBalance](#assetbalance) objects (defined below).

##### Example (`data` field content)

```js
{
  "USDT": {
    "total": 10000.50,
    "free": 8500.25,
    "used": 1500.25
  },
  "BTC": {
    "total": 0.5,
    "free": 0.2,
    "used": 0.3
  }
}
```

---

<a id="assetbalance"></a>
## `AssetBalance`

Represents the balance for a single asset, used within the `WalletBalance` object.

**Fields:**

| Field Name | Type     | Description                                                    |
|------------|----------|----------------------------------------------------------------|
| `total`    | `number` | Total balance of the asset.                                    |
| `free`     | `number` | Available balance for trading or withdrawals.                  |
| `used`     | `number` | Balance currently reserved for open orders or positions (frozen).|

##### Example (Value part of the `WalletBalance` map)

```js
{
  "total": 10000.50,
  "free": 8500.25,
  "used": 1500.25
}
```

---

<a id="order"></a>
## `Order`

Represents a trading order, returned by `GET /api/v1/trade/order` and within lists from `GET /api/v1/trade/order/open-orders` and `GET /api/v1/trade/order/history`.

**Fields:**

| Field Name      | Type                  | Description                                                       |
|-----------------|-----------------------|-------------------------------------------------------------------|
| `clientOrderId` | `string`              | Client-generated unique order identifier.                         |
| `datetime`      | `string`              | ISO8601 formatted datetime string of order creation.              |
| `timestamp`     | `number`              | Unix timestamp (ms) of order creation.                            |
| `symbol`        | `string`              | Trading pair symbol.                                              |
| `type`          | `string`              | Order type (e.g., 'MARKET', 'LIMIT').                               |
| `timeInForce`   | `string`              | Time in force policy (e.g., 'GTC', 'IOC', 'FOK').                   |
| `side`          | `string`              | Order side ('BUY' or 'SELL').                                       |
| `price`         | `number`              | Order price (can be 0 for market orders).                           |
| `amount`        | `number`              | Order amount in the base asset.                                    |
| `filled`        | `number`              | Amount of the order that has been filled.                           |
| `remaining`     | `number`              | Amount of the order remaining to be filled.                        |
| `status`        | `string` \| `undefined` | Order status (e.g., 'new', 'filled', 'canceled').                   |
| `reduceOnly`    | `boolean`             | Whether the order is reduce-only.                                  |
| `postOnly`      | `boolean`             | Whether the order is post-only.                                    |
| `average`       | `number` \| `undefined` | Average fill price if partially/fully filled.                       |
| `trades`        | `Array<object>` \| `undefined` | List of trade objects associated with filling this order.       |
| `info`          | `object` \| `undefined` | Raw order data object from the exchange.                           |

##### Example (`data` field content for `GET /api/v1/trade/order`)

```js
{
  "clientOrderId": "myLimitOrder456",
  "datetime": "2025-04-05T13:05:00.000Z",
  "timestamp": 1712346300000,
  "symbol": "BTCUSDT",
  "type": "LIMIT",
  "timeInForce": "GTC",
  "side": "SELL",
  "price": 66000.00,
  "amount": 0.1,
  "filled": 0,
  "remaining": 0.1,
  "status": "new",
  "reduceOnly": false,
  "postOnly": false,
  "average": null,
  "trades": [],
  "info": { /* raw exchange data */ }
}
```

---

<a id="position"></a>
## `Position`

Represents a futures trading position, returned within arrays from `GET /api/v1/trade/positions`.

**Fields:**

| Field Name         | Type                 | Description                                                      |
|--------------------|----------------------|------------------------------------------------------------------|
| `id`               | `string`             | Unique position identifier.                                      |
| `symbol`           | `string`             | Trading pair symbol.                                             |
| `timestamp`        | `number`             | Unix timestamp (ms) when the position data was generated.        |
| `datetime`         | `string`             | ISO8601 formatted datetime string.                               |
| `side`             | `string`             | Position side ('buy'/'long' or 'sell'/'short').                    |
| `contracts`        | `number`             | Size of the position in contracts.                               |
| `contractSize`     | `number`             | Size of one contract in the base asset.                          |
| `entryPrice`       | `number`             | Average entry price of the position.                             |
| `notional`         | `number`             | Notional value of the position.                                  |
| `leverage`         | `number`             | Leverage used for this position.                                 |
| `initialMargin`    | `number`             | Initial margin requirement.                                      |
| `liquidationPrice` | `number`             | Estimated liquidation price.                                     |
| `marginMode`       | `string`             | Margin mode ('isolated' or 'cross').                               |
| `status`           | `string` \| `undefined` | Position status (e.g., 'OPEN', 'CLOSED', 'LIQUIDATED').            |

##### Example (Single element in the `data` array for `GET /api/v1/trade/positions`)

```js
{
  "id": "pos-btc-long-123",
  "symbol": "BTCUSDT",
  "timestamp": 1712347500000,
  "datetime": "2025-04-05T13:25:00.000Z",
  "side": "long",
  "contracts": 0.05,
  "contractSize": 1,
  "entryPrice": 65100.00,
  "notional": 3255.00,
  "leverage": 10,
  "initialMargin": 325.50,
  "liquidationPrice": 59000.00,
  "marginMode": "isolated",
  "status": "OPEN"
}
```

---

<a id="leverage"></a>
## `Leverage`

Represents user leverage settings for a trading pair, returned by leverage-related endpoints.

**Fields:**

| Field Name      | Type     | Description                                                      |
|-----------------|----------|------------------------------------------------------------------|
| `symbol`        | `string` | Trading pair symbol.                                             |
| `marginMode`    | `string` | Margin mode ('isolated' or 'cross').                             |
| `longLeverage`  | `number` | Leverage setting for long positions.                             |
| `shortLeverage` | `number` | Leverage setting for short positions.                            |
| `info`          | `object` | Raw leverage data from the exchange (may contain `leverage`, `updatedLeverage`, etc.). |

##### Example (`data` field content for `GET /api/v1/trade/userLeverage`)

```js
{
  "symbol": "BTCUSDT",
  "marginMode": "isolated",
  "longLeverage": 10,
  "shortLeverage": 10,
  "info": {
    "contractName": "BTCUSDT",
    "leverage": 10,
    "openPositionCount": 1
  }
}
```

---

<a id="trade"></a>
## `Trade`

Represents a completed trade execution, returned in lists from `GET /api/v1/trade/history`.

**Fields:**

| Field Name     | Type     | Description                                                     |
|----------------|----------|-----------------------------------------------------------------|
| `id`           | `string` | Unique trade identifier.                                          |
| `timestamp`    | `number` | Unix timestamp in milliseconds.                                 |
| `datetime`     | `string` | ISO8601 formatted datetime string.                                |
| `symbol`       | `string` | Trading pair symbol.                                              |
| `order`        | `string` | Identifier of the order associated with this trade.               |
| `type`         | `string` | Order type that resulted in this trade (e.g., 'market').            |
| `side`         | `string` | Trade side ('buy' or 'sell').                                     |
| `takerOrMaker` | `string` | Whether the user was the taker or maker.                          |
| `price`        | `number` | Execution price of the trade.                                     |
| `amount`       | `number` | Amount traded in the base asset.                                  |
| `cost`         | `number` | Total cost of the trade in the quote asset (price * amount).        |
| `fee`          | `object` | Object detailing the fee paid.                                    |
| `  cost`       | `number` | Amount of the fee.                                                |
| `  currency`   | `string` | Currency the fee was paid in.                                     |
| `info`         | `object` | Raw trade data object from the exchange.                          |

##### Example (Single element in the `data` array for `GET /api/v1/trade/history`)

```js
{
  "id": "trade123",
  "timestamp": 1712240400500,
  "datetime": "2025-04-04T10:00:00.500Z",
  "symbol": "BTCUSDT",
  "order": "orderLink111",
  "type": "market",
  "side": "buy",
  "takerOrMaker": "taker",
  "price": 65050.00,
  "amount": 0.01,
  "cost": 650.50,
  "fee": { "cost": 0.6505, "currency": "USDT" },
  "info": { /* ... raw exchange data ... */ }
}
```

---

<a id="transaction"></a>
## `Transaction`

Represents a wallet transaction (e.g., fee, funding), returned in lists from `GET /api/v1/trade/transaction/history`.

**Fields:**

| Field Name | Type     | Description                                                     |
|------------|----------|-----------------------------------------------------------------|
| `txid`     | `string` | Unique transaction identifier.                                   |
| `timestamp`| `number` | Unix timestamp in milliseconds.                                  |
| `datetime` | `string` | ISO8601 formatted datetime string.                                 |
| `type`     | `string` | Type of transaction (e.g., 'COMMISSION', 'FUNDING_FEE').           |
| `amount`   | `number` | Amount of the transaction (can be negative).                       |
| `currency` | `string` | Currency of the transaction.                                       |
| `status`   | `string` | Status of the transaction.                                         |
| `fee`      | `object` | Object detailing any fee associated (often implicit in amount).      |
| `info`     | `object` | Raw transaction data from the exchange.                            |

##### Example (Single element in the `data` array for `GET /api/v1/trade/transaction/history`)

```js
{
  "txid": "txn-fee-abc",
  "timestamp": 1712154000000,
  "datetime": "2025-04-03T12:00:00.000Z",
  "type": "COMMISSION",
  "amount": -0.6505,
  "currency": "USDT",
  "status": "completed",
  "fee": {},
  "info": { /* ... raw exchange data ... */ }
}
```

---

<a id="exchangeinfo"></a>
## `ExchangeInfo`

Represents detailed exchange configuration, returned within the `data` field of `GET /api/v1/exchange/exchangeInfo`. This is a complex object containing arrays and nested objects for trading rules, filters, leverage, fee tiers, and more.

> 🔗 **Explore full schema:** [GET /api/v1/exchange/exchangeInfo – OpenAPI Docs](https://api.zebapi.com/docs#operation/getExchangeInfo)

**Top-Level Fields:**

| Field Name        | Type            | Description                                                                                                  |
|-------------------|-----------------|--------------------------------------------------------------------------------------------------------------|
| `pairs`           | `Array<object>` | List of objects detailing rules for each trading pair (filters, fees, leverage, precision, assets, etc.).      |
| `quoteCurrencies` | `Array<object>` | List of objects describing available quote currencies.                                                     |
| `categories`      | `Array<string>` | List of asset categories (e.g., "AI", "DeFi").                                                                 |
| `conversionRates` | `object`        | Object containing various currency conversion rates used by the exchange.                                    |

*Refer to the `ExchangeInfo` typedef in `node/utils/types.js` for the detailed nested structure of `pairs`, `quoteCurrencies`, etc.*

##### Example (`data` field content - highly truncated)

```js
{
  "pairs": [
    {
      "name": "Bitcoin",
      "pair": "BTCUSDT",
      "orderTypes": ["MARKET", "LIMIT"],
      "filters": [
        { "filterType": "LIMIT_QTY_SIZE", "maxQty": "100", "minQty": "0.0001" },
        { /* other filters */ }
      ],
      "makerFee": 0.001,
      "takerFee": 0.002,
      "maxLeverage": 100,
      "minLeverage": 1,
      "pricePrecision": "2",
      "quantityPrecision": "4",
      "baseAsset": "BTC",
      "quoteAsset": "USDT",
      "marginAssetsSupported": ["USDT"]
      // ... many more fields per pair ...
    }
    // ... other pairs
  ],
  "quoteCurrencies": [
    { "code": "USDT", "name": "Tether", "currencyPrecision": 2 /* ... */ }
  ],
  "categories": ["Crypto", "Major"],
  "conversionRates": { "INR_MARGIN_USDT": 0.012, /* ... */ }
}
```

---

<a id="pairsinfo"></a>
## `PairsInfo`

Represents high-level metadata about all supported trading pairs, returned within the `data` field of `GET /api/v1/exchange/pairs`. Ideal for quickly listing active pairs, quote assets, and transaction types.

Explore all

**Top-Level Fields:**

| Field Name        | Type            | Description                                                                       |
|-------------------|-----------------|-----------------------------------------------------------------------------------|
| `pairs`           | `Array<object>` | List of objects with basic info for each pair (name, symbol, status, icon, assets). |
| `types`           | `Array<string>` | List of available transaction types (e.g., "FUNDING_FEE", "COMMISSION").         |
| `quoteCurrencies` | `Array<object>` | List of objects describing available quote currencies.                          |
| `categories`      | `Array<string>` | List of asset categories.                                                         |
| `conversionRates` | `object`        | Object containing various currency conversion rates.                            |

*Refer to the `PairsInfo` typedef in `node/utils/types.js` for the detailed nested structure.*

##### Example (`data` field content - truncated)

```js
{
  "pairs": [
    {
      "name": "Bitcoin",
      "pair": "BTCUSDT",
      "isActive": true,
      "iconURL": "https://example.com/btc.png",
      "baseAsset": "BTC",
      "quoteAsset": "USDT",
      "marginAsset": "USDT"
    },
    {
      "name": "Ethereum",
      "pair": "ETHUSDT",
      "isActive": true,
      "iconURL": "https://example.com/eth.png",
      "baseAsset": "ETH",
      "quoteAsset": "USDT",
      "marginAsset": "USDT"
    }
    // ... other pairs
  ],
  "types": ["FUNDING_FEE", "COMMISSION"],
  "quoteCurrencies": [
    { "code": "USDT", "name": "Tether", "currencyPrecision": 2 }
  ],
  "categories": ["Crypto", "Major", "Smart Contract"],
  "conversionRates": { "INR_MARGIN_USDT": 0.012, /* ... */ }
}
```

---

<a id="responsedatamodelsactions"></a>
## Response Data Models (Actions)

These models describe the structure within the `data` field for specific POST/DELETE action responses.

---

<a id="createorderresponsedata"></a>
### `CreateOrderResponseData`

Response from `POST /api/v1/trade/order`. This structure is also used as the base for responses when adding TP/SL or closing positions.

* **Structure:** Generally inherits fields from the [Order](#order) model, representing the details of the newly created order. Key fields typically include `clientOrderId`, `timestamp`, `symbol`, `type`, `side`, `price`, `amount`, `status`, etc.

##### Example (`data` field content)

```js
{
  "clientOrderId": "myNewOrder123",
  "datetime": "2025-04-05T13:10:00.123Z",
  "timestamp": 1712346600123,
  "symbol": "BTCUSDT",
  "type": "MARKET",
  "timeInForce": "GTC",
  "side": "BUY",
  "price": 0,
  "amount": 0.001,
  "filled": 0.001,
  "remaining": 0,
  "reduceOnly": false,
  "postOnly": false,
  "status": "filled"
}
```

---

<a id="addtpslresponsedata"></a>
### `AddTPSLResponseData`

Response from `POST /api/v1/trade/order/addTPSL`.

* **Structure:** This is an alias for [CreateOrderResponseData](#createorderresponsedata). Refer to the `CreateOrderResponseData` definition for fields and examples.

---

<a id="closepositionresponsedata"></a>
### `ClosePositionResponseData`

Response from `POST /api/v1/trade/position/close`.

* **Structure:** This is an alias for [CreateOrderResponseData](#createorderresponsedata), as closing a position effectively creates a market order. Refer to the `CreateOrderResponseData` definition for fields and examples.

---

<a id="cancelorderresponsedata"></a>
### `CancelOrderResponseData`

Response from `DELETE /api/v1/trade/order`. This has a unique structure.

**Fields:**

| Field Name      | Type     | Description                                                    |
|-----------------|----------|----------------------------------------------------------------|
| `clientOrderId` | `string` | The ID of the order requested for cancellation.              |
| `status`        | `string` | Status confirming cancellation (e.g., "canceled").             |
| `symbol`        | `string` | Trading pair symbol.                                           |
| `info`          | `object` | Raw cancellation response data from the exchange (may include `orderId`, `success`). |

##### Example (`data` field content)

```js
{
  "clientOrderId": "myLimitOrder456",
  "status": "canceled",
  "symbol": "BTCUSDT",
  "info": {
    "clientOrderId": "myLimitOrder456",
    "orderId": "987654321",
    "status": "CANCELED",
    "success": true
  }
}
```

---

<a id="marginresponse"></a>
### `MarginResponse`

Response from `POST /api/v1/trade/addMargin` and `POST /api/v1/trade/reduceMargin`.

**Fields:**

| Field Name | Type     | Description                                                      |
|------------|----------|------------------------------------------------------------------|
| `info`     | `object` | Raw margin operation data (may include `lockedBalance`, `withdrawableBalance`, `asset`, `message`). |
| `type`     | `string` | Type of operation ('add' or 'reduce').                           |
| `amount`   | `number` | Amount of margin added/reduced.                                  |
| `code`     | `string` | Asset/currency code.                                             |
| `symbol`   | `string` | Trading pair symbol.                                             |
| `status`   | `string` | Status of the margin operation (e.g., "ok").                     |

##### Example (`data` field content for Add Margin)

```js
{
  "info": {
    "lockedBalance": 150.50,
    "withdrawableBalance": 8350.00,
    "asset": "USDT",
    "message": "Margin added successfully"
  },
  "type": "add",
  "amount": 100.0,
  "code": "USDT",
  "symbol": "BTCUSDT",
  "status": "ok"
}
```

---

<a id="paginatedlistresponsemodels"></a>
## Paginated List Response Models

These models describe the structure within the `data` field when fetching lists of historical data.

---

<a id="orderslistresponse"></a>
### `OrdersListResponse`

Response from `GET /api/v1/trade/order/open-orders` and `GET /api/v1/trade/order/history`.

**Fields:**

| Field Name      | Type             | Description                                                           |
|-----------------|------------------|-----------------------------------------------------------------------|
| `data`          | `Array<Order>`   | List of [Order](#order) objects.                                      |
| `totalCount`    | `number`         | Total number of records matching the query (may not always be present/accurate). |
| `nextTimestamp` | `number`\|`null`  | Timestamp for fetching the next page (pagination cursor).             |

##### Example (`data` field content from `GET /api/v1/trade/order/history`)

```js
{
  "data": [
    {
      "clientOrderId": "myMarketOrder111",
      "datetime": "2025-04-04T10:00:00.000Z",
      // ... other order fields ...
      "status": "filled"
    },
    {
      "clientOrderId": "myLimitOrder222",
      "datetime": "2025-04-04T11:00:00.000Z",
      // ... other order fields ...
      "status": "canceled"
    }
  ],
  "totalCount": 50,
  "nextTimestamp": 1712240399999
}
```

---

<a id="tradeslistresponse"></a>
### `TradesListResponse`

Response from `GET /api/v1/trade/history`.

**Fields:**

| Field Name      | Type             | Description                                              |
|-----------------|------------------|----------------------------------------------------------|
| `data`          | `Array<Trade>`   | List of [Trade](#trade) objects.                         |
| `totalCount`    | `number`         | Total number of records matching the query.            |
| `nextTimestamp` | `number`\|`null`  | Timestamp for fetching the next page.                  |

##### Example (`data` field content from `GET /api/v1/trade/history`)

```js
{
  "data": [
    {
      "id": "trade123",
      "timestamp": 1712240400500,
      // ... other trade fields ...
      "price": 65050.00,
      "amount": 0.01,
      "fee": { "cost": 0.6505, "currency": "USDT" }
    }
    // ... other trades
  ],
  "totalCount": 120,
  "nextTimestamp": 1712240400499
}
```

---

<a id="transactionslistresponse"></a>
### `TransactionsListResponse`

Response from `GET /api/v1/trade/transaction/history`.

**Fields:**

| Field Name      | Type                  | Description                                               |
|-----------------|-----------------------|-----------------------------------------------------------|
| `data`          | `Array<Transaction>`  | List of [Transaction](#transaction) objects.              |
| `totalCount`    | `number`              | Total number of records matching the query.             |
| `nextTimestamp` | `number`\|`null`       | Timestamp for fetching the next page.                     |

##### Example (`data` field content from `GET /api/v1/trade/transaction/history`)

```js
{
  "data": [
    {
      "txid": "txn-fee-abc",
      "timestamp": 1712154000000,
      "type": "COMMISSION",
      "amount": -0.6505,
      "currency": "USDT",
      // ... other transaction fields ...
      "status": "completed"
    },
    {
      "txid": "txn-funding-def",
      "timestamp": 1712067600000,
      "type": "FUNDING_FEE",
      "amount": -1.2345,
      "currency": "USDT",
      // ... other transaction fields ...
      "status": "completed"
    }
  ],
  "totalCount": 35,
  "nextTimestamp": 1712067599999
}
```

---

<a id="errorresponse"></a>
## Error Response Structure

*(This section defines the expected structure when an API call results in an error. Define based on your actual API implementation.)*

**Common Fields (Example):**

| Field Name | Type                | Description                                 |
|------------|---------------------|---------------------------------------------|
| `code`     | `string`\|`number`  | An internal error code.                     |
| `message`  | `string`            | A human-readable error message.             |
| `details`  | `object`\|`string`  | Additional error details (optional).        |

##### Example (Hypothetical Error within `ApiResponse.data` or as root object)

```js
// Example 1: Error details within ApiResponse.data
{
  "statusDescription": "Client Error",
  "data": {
      "code": "INVALID_PARAMETER",
      "message": "Symbol parameter is missing or invalid."
  },
  "statusCode": 400,
  "customMessage": ["Bad Request: Check parameters."]
}

// Example 2: Root object as error structure (if ApiResponse is not used for errors)
{
  "error": {
    "code": "AUTH_FAILURE",
    "message": "Invalid API key or signature."
  }
}
```
