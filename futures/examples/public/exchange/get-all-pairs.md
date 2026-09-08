# Example: Get Pairs Info

Retrieves information about all available trading pairs, including status, assets, and icons.

**Endpoint:** `GET /api/v1/exchange/pairs`
**Authentication:** None Required
**Parameters:** None .

---

### 1. cURL Example

**Request:**

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/exchange/pairs \
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
    "quoteCurrencies": [ { "code": "USDT", "name": "Tether" /* ... */ } ],
    "categories": ["Crypto", "Major"],
    "conversionRates": { /* ... conversion rates ... */ }
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: This response contains basic info for all pairs.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](../../../clients/rest-http/node/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function getPairsInfoExample() {
  try {
    console.log("Fetching pairs info...");
    const response = await client.getPairs(); //
    console.log("API Response Status:", response.statusCode);
    console.log("Response contains data:", response.data && typeof response.data === 'object');


    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Pairs Info Data received.");
      // Example: List active pair symbols
      // const activePairs = response.data.pairs
      //   .filter(p => p.isActive)
      //   .map(p => p.pair);
      // console.log("Active Pairs:", activePairs.slice(0, 5)); // Log first 5
    } else {
      console.error("Failed to fetch pairs info:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching pairs info:", error.message);
  }
}

// Example usage:
getPairsInfoExample();
```

**Output (Example):**

```text
// Console output showing status and confirmation
Fetching pairs info...
API Response Status: 200
Response contains data: true
Pairs Info Data received.
// Example output if accessing specific data:
// Active Pairs: [ 'BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT' ]
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](../../../clients/rest-http/python/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def get_pairs_info_example():
    try:
        print("Fetching pairs info...")
        response = client.get_pairs() #
        print(f"API Response Status: {response.get('statusCode')}")
        data = response.get('data')
        print(f"Response contains data: {isinstance(data, dict)}")

        if response and response.get("statusCode") in [200, 201]:
            print("Pairs Info Data received.")
            # Example: List active pair symbols
            # pairs_data = data.get('pairs', [])
            # active_pairs = [p.get('pair') for p in pairs_data if p.get('isActive')]
            # print(f"Active Pairs (first 5): {active_pairs[:5]}")
        else:
            print(f"Failed to fetch pairs info: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching pairs info: {e}")

# Example usage:
get_pairs_info_example()
```

**Output (Example):**

```text
// Console output showing status and confirmation
Fetching pairs info...
API Response Status: 200
Response contains data: True
Pairs Info Data received.
// Example output if accessing specific data:
// Active Pairs (first 5): ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT']
```

---
