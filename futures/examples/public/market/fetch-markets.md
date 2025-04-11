# Example: Fetch Markets

Retrieves details about all available trading symbols (markets), including their status, precision, fees, leverage limits, and exchange metadata.

**Endpoint:** `GET /api/v1/market/markets`
**Authentication:** None Required
**Parameters:** None
---

### 1. cURL Example

**Request:**

```bash
# Replace BTCUSDT with the desired symbol
curl -X GET https://futuresbe.zebpay.com/api/v1/market/orderBook?symbol=BTCUSDT \
  -H "Accept: application/json"
```

**Success Response (Example):**

```json
{
  "statusDescription": "OK",
  "data": {
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
        "baseAssetPrecision": 0,
        "quotePrecision": 0,
        "orderTypes": [ "LIMIT", "MARKET" ],
        "timeInForce": [ "GTC" ],
        "makerFee": 0.05,
        "takerFee": 0.1,
        "minLeverage": 1,
        "maxLeverage": 20
      }
      // ... other symbols
    ]
  },
  "statusCode": 200,
  "customMessage": [ "OK" ]
}
```

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](futures/clients/rest-http/node/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function fetchMarketsExample() {
  try {
    console.log("Fetching all markets...");
    const response = await client.fetchMarkets(); // [cite: futures/clients/rest-http/node/client.js]
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Markets Response Data:", response.data);
      // Access the list of symbols:
      // const symbolsList = response.data.symbols;
      // console.log(`Found ${symbolsList.length} symbols.`);
      // const xrpSymbol = symbolsList.find(s => s.symbol === 'XRPINR');
      // if (xrpSymbol) {
      //   console.log(`XRP/INR Max Leverage: ${xrpSymbol.maxLeverage}`);
      // }
    } else {
      console.error("Failed to fetch markets:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching markets:", error.message);
    if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
fetchMarketsExample();
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching all markets...
API Response: {
  "statusDescription": "OK",
  "data": {
    "timezone": "UTC",
    "serverTime": 1744364554387,
    "rateLimits": [],
    "exchangeFilters": [],
    "symbols": [
      {
        "symbol": "1000PEPEINR",
        // ... other fields ...
        "maxLeverage": 10
      },
      // ... more symbols
    ]
  },
  "statusCode": 200,
  "customMessage": [ "OK" ]
}
// Followed by the extracted data
Markets Response Data: {
  "timezone": "UTC",
  "serverTime": 1744364554387,
  "rateLimits": [],
  "exchangeFilters": [],
  "symbols": [ /* ... list of symbol objects ... */ ]
}
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](futures/clients/rest-http/python/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def fetch_markets_example():
    try:
        print("Fetching all markets...")
        response = client.fetch_markets() # [cite: futures/clients/rest-http/python/client/client.py]
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            markets_data = response.get('data')
            print(f"Markets Response Data: {markets_data}")
            # Access the list of symbols:
            # symbols_list = markets_data.get('symbols', [])
            # print(f"Found {len(symbols_list)} symbols.")
            # xrp_symbol = next((s for s in symbols_list if s.get('symbol') == 'XRPINR'), None)
            # if xrp_symbol:
            #     print(f"XRP/INR Max Leverage: {xrp_symbol.get('maxLeverage')}")
        else:
            print(f"Failed to fetch markets: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching markets: {e}")

# Example usage:
fetch_markets_example()
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching all markets...
API Response: {
  "statusDescription": "OK",
  "data": {
    "timezone": "UTC",
    "serverTime": 1744364554387,
    "rateLimits": [],
    "exchangeFilters": [],
    "symbols": [
      {
        "symbol": "1000PEPEINR",
        // ... other fields ...
        "maxLeverage": 10
      },
      // ... more symbols
    ]
  },
  "statusCode": 200,
  "customMessage": [ "OK" ]
}
// Followed by the extracted data
Markets Response Data: {'timezone': 'UTC', 'serverTime': 1744364554387, 'rateLimits': [], 'exchangeFilters': [], 'symbols': [ { ... }, { ... } ]}
```
