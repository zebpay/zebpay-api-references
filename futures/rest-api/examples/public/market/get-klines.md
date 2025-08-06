# Example: Get K-Lines (OHLCV Data)

Retrieves historical candlestick data (Open, High, Low, Close, Volume) for a specified trading symbol and timeframe.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Get K-Lines](../../../reference-docs/public-endpoints/market.md#get-klines).

**Endpoint:** `POST /api/v1/market/klines`
**Authentication:** Not Required

-----

### 1. cURL Example

```bash
curl -X POST https://futuresbe.zebpay.com/api/v1/market/klines \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
        "symbol": "BTCINR",
        "interval": "1h",
        "limit": 100
      }'
```

#### Success Response (Example)

```json
{
    "data": [
        [
            1612345678000, //startTs
            "5500000",  //open
            "5600000",  //high
            "5400000",  //low
            "5550000",  //close
            "10.5",     //volume
            1612345738000 //endTs
        ]
    ]
}
```

-----

### 2\. Node.js Client Example

> **💡 Tip:** See [Node.js Client README](../../clients/http/node/README.md).

```javascript
async function getKlinesExample(klineParams) {
  try {
    console.log(`Fetching k-lines for symbol: ${klineParams.symbol}...`);
    const response = await client.getKlines(klineParams);
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && response.data) {
      console.log("K-Lines Data:", response.data);
    } else {
      console.error("Failed to fetch k-lines:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching k-lines:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
const klineParams = {
  symbol: "BTCINR",
  interval: "1h",
  limit: 100
};
getKlinesExample(klineParams);
```

**Output (Example):**

```js
// Full API response first...
Fetching k-lines for symbol: BTCINR...
API Response: {
  "data": [ // ... (data as shown in cURL example) ... ]
}
// Extracted data...
K-Lines Data: [ // ... (data as shown in cURL example) ... ]
```

-----

### 3\. Python Client Example

> **💡 Tip:** See [Python Client README](../../clients/http/python/README.md).

```python
import json

def get_klines_example(kline_params):
    try:
        print(f"Fetching k-lines for symbol: {kline_params.get('symbol')}...")
        response = client.get_klines(kline_params=kline_params)
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("data"):
            print(f"K-Lines Data: {response.get('data')}")
        else:
            print(f"Failed to fetch k-lines: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error fetching k-lines: {e}")

# Example usage:
kline_params = {
  "symbol": "BTCINR",
  "interval": "1h",
  "limit": 100
}
get_klines_example(kline_params)
```

**Output (Example):**

```js
// Full API response first...
Fetching k-lines for symbol: BTCINR...
API Response: {
  "data": [ // ... (data as shown in cURL example, Python format) ... ]
}
// Extracted data...
K-Lines Data: [ // ... (data as shown in cURL example, Python format) ... ]
```
