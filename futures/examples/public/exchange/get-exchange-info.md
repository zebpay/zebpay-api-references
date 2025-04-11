# Example: Get Exchange Info

Retrieves comprehensive exchange configuration information, including trading rules, filters, limits, precision settings, supported assets, etc.

**Endpoint:** `GET /api/v1/exchange/exchangeInfo`
**Authentication:** None Required
**Parameters:** None .

---

### 1. cURL Example

**Request:**

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/exchange/exchangeInfo \
  -H "Accept: application/json"
```

**Success Response (Example - Highly Truncated):**

```json
{
  "statusDescription": "Success",
  "data": {
    "pairs": [
      {
        "name": "Bitcoin",
        "pair": "BTCUSDT",
        "orderTypes": ["MARKET", "LIMIT"],
        "filters": [ { "filterType": "LIMIT_QTY_SIZE", "maxQty": "100", "minQty": "0.0001" } /* , ... */ ],
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
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: This response is very large and contains detailed configuration for all pairs.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](futures/clients/rest-http/node/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function getExchangeInfoExample() {
  try {
    console.log("Fetching exchange info...");
    const response = await client.getExchangeInfo(); //
    // Log only a portion due to size
    console.log("API Response Status:", response.statusCode);
    console.log("Response contains data:", response.data && typeof response.data === 'object');

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Exchange Info Data received (structure is complex).");
      // Example: Accessing info for a specific pair
      // const pairs = response.data.pairs;
      // const btcPairInfo = pairs.find(p => p.pair === 'BTCUSDT');
      // if (btcPairInfo) {
      //   console.log(`BTC Max Leverage: ${btcPairInfo.maxLeverage}`);
      //   console.log(`BTC Price Precision: ${btcPairInfo.pricePrecision}`);
      // }
    } else {
      console.error("Failed to fetch exchange info:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching exchange info:", error.message);
  }
}

// Example usage:
getExchangeInfoExample();
```

**Output (Example):**

```text
// Console output showing status and confirmation
Fetching exchange info...
API Response Status: 200
Response contains data: true
Exchange Info Data received (structure is complex).
// Example output if accessing specific data:
// BTC Max Leverage: 100
// BTC Price Precision: 2
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](futures/clients/rest-http/python/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def get_exchange_info_example():
    try:
        print("Fetching exchange info...")
        response = client.get_exchange_info() #
        # Log only a portion due to size
        print(f"API Response Status: {response.get('statusCode')}")
        data = response.get('data')
        print(f"Response contains data: {isinstance(data, dict)}")


        if response and response.get("statusCode") in [200, 201]:
            print("Exchange Info Data received (structure is complex).")
            # Example: Accessing info for a specific pair
            # pairs = data.get('pairs', [])
            # btc_pair_info = next((p for p in pairs if p.get('pair') == 'BTCUSDT'), None)
            # if btc_pair_info:
            #     print(f"BTC Max Leverage: {btc_pair_info.get('maxLeverage')}")
            #     print(f"BTC Price Precision: {btc_pair_info.get('pricePrecision')}")
        else:
            print(f"Failed to fetch exchange info: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching exchange info: {e}")

# Example usage:
get_exchange_info_example()
```

**Output (Example):**

```text
// Console output showing status and confirmation
Fetching exchange info...
API Response Status: 200
Response contains data: True
Exchange Info Data received (structure is complex).
// Example output if accessing specific data:
// BTC Max Leverage: 100
// BTC Price Precision: 2
```
