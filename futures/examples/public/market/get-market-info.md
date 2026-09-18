# Example: Get Market Info

Retrieves high-level market information, potentially including metrics for multiple symbols.

**Endpoint:** `GET /api/v1/market/marketInfo`
**Authentication:** None Required
**Parameters:** None .

---

### 1. cURL Example

**Request:**

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/market/marketInfo \
  -H "Accept: application/json"
```

**Success Response (Example):**

```json
{
  "statusDescription": "OK",
  "data": {
    "BTCUSDT": {
      "marketPrice": "65150.00",
      "lastPrice": "65150.00",
      "priceChangePercent": "0.23",
      "baseAssetVolume": "1500.50"
    },
    "ETHUSDT": {
      "marketPrice": "3300.00",
      "lastPrice": null,
      "priceChangePercent": null,
      "baseAssetVolume": null
    }
    // ... potentially other symbols
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}

```
*Note: Values reflect live data for active markets. `lastPrice`, `priceChangePercent`, and `baseAssetVolume` can be `null` when unavailable. Additional upstream market metrics may also be present.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](../../../clients/rest-http/node/README.md) for setup instructions.

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function getMarketInfoExample() {
  try {
    console.log("Fetching market info...");
    const response = await client.getMarketInfo();
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Market Info Data:", response.data);
      // Access info for a specific symbol:
      // const btcInfo = response.data.BTCUSDT;
      // if (btcInfo) {
      //   console.log(`BTC Market Price: ${btcInfo.marketPrice}`);
      // }
    } else {
      console.error("Failed to fetch market info:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching market info:", error.message);
  }
}

// Example usage:
getMarketInfoExample();
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching market info...
API Response: {
  "statusDescription": "OK",
  "data": {
    "BTCUSDT": {
      "marketPrice": "65150.00",
      "lastPrice": "65150.00",
      "priceChangePercent": "0.23",
      "baseAssetVolume": "1500.50"
    },
    "ETHUSDT": {
      "marketPrice": "3300.00",
      "lastPrice": null,
      "priceChangePercent": null,
      "baseAssetVolume": null
    }
    // ...
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Market Info Data: {
  "BTCUSDT": { ... },
  "ETHUSDT": { ... }
  // ...
}
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](../../../clients/rest-http/python/README.md) for setup instructions.

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def get_market_info_example():
    try:
        print("Fetching market info...")
        response = client.get_market_info()
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Market Info Data: {response.get('data')}")
            # Access info for a specific symbol:
            # data = response.get('data', {})
            # btc_info = data.get('BTCUSDT')
            # if btc_info:
            #     print(f"BTC Market Price: {btc_info.get('marketPrice')}")
        else:
            print(f"Failed to fetch market info: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching market info: {e}")

# Example usage:
get_market_info_example()
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching market info...
API Response: {
  "statusDescription": "OK",
  "data": {
    "BTCUSDT": {
      "marketPrice": "65150.00",
      "lastPrice": "65150.00",
      "priceChangePercent": "0.23",
      "baseAssetVolume": "1500.50"
    },
    "ETHUSDT": {
      "marketPrice": "3300.00",
      "lastPrice": null,
      "priceChangePercent": null,
      "baseAssetVolume": null
    }
    // ...
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Market Info Data: {'BTCUSDT': {...}, 'ETHUSDT': {...}, ...}
```
