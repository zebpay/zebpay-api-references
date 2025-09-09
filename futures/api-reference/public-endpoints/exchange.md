# API Reference: Public Exchange Endpoints

These endpoints provide public information about exchange configurations, trading pairs, and fees. **Authentication is not required.**

---

### Get Trade Fee (Single Symbol)

Retrieves trading fee details (maker/taker) for a specific trading symbol.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/exchange/tradefee` |
| **Auth Required**| No                          |
| **Query Params** | `symbol` (string, required) |
| **Request Body** | N/A                         |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** (object):
- **`symbol`** (`string`): The trading symbol queried.
- **`makerFee`** (`number`): The maker fee rate.
- **`takerFee`** (`number`): The taker fee rate.

##### Example (`data` field content)

```json
{
  "symbol": "BTCUSDT",
  "makerFee": 0.001,
  "takerFee": 0.002
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### Get Trade Fees (All Symbols)

Retrieves trading fee details for all supported trading pairs.

#### Request

| Attribute       | Value                        |
| :-------------- | :--------------------------- |
| **HTTP Method** | `GET`                        |
| **Endpoint Path**| `/api/v1/exchange/tradefees` |
| **Auth Required**| No                           |
| **Query Params** | None                         |
| **Request Body** | N/A                          |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** (Array<object>):
- A list where each object contains `symbol` (`string`), `makerFee` (`number`), and `takerFee` (`number`) for a trading pair.

##### Example (`data` field content - excerpt)

```json
[
  {
    "symbol": "BTCUSDT",
    "makerFee": 0.001,
    "takerFee": 0.002
  },
  {
    "symbol": "ETHUSDT",
    "makerFee": 0.0012,
    "takerFee": 0.0022
  }
]
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### Get Exchange Info

Retrieves comprehensive exchange configuration information, including trading rules, filters, limits, precision settings, supported assets, etc.

#### Request

| Attribute       | Value                           |
| :-------------- | :------------------------------ |
| **HTTP Method** | `GET`                           |
| **Endpoint Path**| `/api/v1/exchange/exchangeInfo` |
| **Auth Required**| No                              |
| **Query Params** | None                            |
| **Request Body** | N/A                             |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([ExchangeInfo](../data-models.md#exchangeinfo) object) :
- Detailed configuration including available pairs, filters, fees, leverage options, supported currencies, conversion rates, etc. Refer to the Data Models section for the full structure.

##### Example (`data` field content - highly truncated)

```json
{
  "pairs": [
    {
      "name": "Bitcoin",
      "pair": "BTCUSDT",
      "orderTypes": ["MARKET", "LIMIT"],
      "filters": [ { "filterType": "LIMIT_QTY_SIZE", "maxQty": "100", "minQty": "0.0001" } ],
      "makerFee": 0.001,
      "takerFee": 0.002,
      "maxLeverage": 100,
      "pricePrecision": "2",
      "quantityPrecision": "4",
      "baseAsset": "BTC",
      "quoteAsset": "USDT",
      "marginAssetsSupported": ["USDT"]
      // ... other pair details
    }
    // ... other pairs
  ],
  "quoteCurrencies": [ { "code": "USDT", "name": "Tether" /* ... */ } ],
  "categories": ["Crypto", "Major"],
  "conversionRates": { /* ... conversion rates ... */ }
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### Get Pairs Info

Retrieves information about all available trading pairs, including status, assets, and icons.

#### Request

| Attribute       | Value                      |
| :-------------- | :------------------------- |
| **HTTP Method** | `GET`                      |
| **Endpoint Path**| `/api/v1/exchange/pairs`  |
| **Auth Required**| No                         |
| **Query Params** | None                       |
| **Request Body** | N/A                        |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([PairsInfo](../data-models.md#pairsinfo) object):
- Includes list of pairs with basic info (name, symbol, status, icon, assets), transaction types, quote currencies, categories, and conversion rates. Refer to the Data Models section for the full structure.

##### Example (`data` field content - highly truncated)

```json
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
    }
    // ... other pairs
  ],
  "types": ["FUNDING_FEE", "COMMISSION"],
  "quoteCurrencies": [ { "code": "USDT", "name": "Tether" /* ... */ } ],
  "categories": ["Crypto", "Major"],
  "conversionRates": { /* ... conversion rates ... */ }
}
```

> See [Error Response Structure](../error-handling.md) for error formats.
