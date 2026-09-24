# Example: Get K-Lines (OHLCV Data)

Retrieves historical candlestick data (Open, High, Low, Close, Volume) for a specified trading symbol and timeframe.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Get K-Lines](../../../api-reference/public-endpoints/market.md#get-klines).

**Endpoint:** `POST /api/v1/market/klines`
**Authentication:** Not Required

**Request fields:**
* `symbol` (string, body, required): Concatenated (`BTCINR`) or slash (`BTC/INR`) notation.
* `timeframe` (string, body, optional): Defaults to `1m`. See the API reference for supported values.
* `since` (integer, body, optional): Inclusive start time in Unix epoch milliseconds.
* `until` (integer, body, optional): Inclusive end time; accepted only with `since`.
* `limit` (integer, body, optional): JSON integer from 1 to 1000. Default: 1000. A numeric string is rejected with 400.
* `priceType` (string, query, optional): `LTP` (default) or `MARK_PRICE`.

Unknown HTTP body fields return `400 Bad Request`. The sample clients accept `interval` and `startTime` as local aliases, but send `timeframe` and `since` to the API.

For `MARK_PRICE`, a missing or malformed upstream volume is returned as `null`.

-----

### 1. cURL Example

```bash
curl -X POST https://futuresbe.zebpay.com/api/v1/market/klines \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
      -d '{
        "symbol": "BTCINR",
        "timeframe": "1h",
        "limit": 100
      }'
```

#### Success Response (Example)

```json
{
  "statusDescription": "OK",
  "data": [
    [
      1612345678000,
      "5500000",
      "5600000",
      "5400000",
      "5550000",
      "10.5",
      1612345738000
    ]
  ],
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

-----

### 2\. Node.js Client Example

> **💡 Tip:** See [Node.js Client README](../../../clients/rest-http/node/README.md).

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
  timeframe: "1h",
  limit: 100
};
getKlinesExample(klineParams);
```

**Output (Example):**

```text
Fetching k-lines for symbol: BTCINR...
API Response: {
  "statusDescription": "OK",
  "data": [
    [1612345678000, "5500000", "5600000", "5400000", "5550000", "10.5", 1612345738000]
  ],
  "statusCode": 200,
  "customMessage": ["OK"]
}
K-Lines Data: [
  [1612345678000, "5500000", "5600000", "5400000", "5550000", "10.5", 1612345738000]
]
```

-----

### 3\. Python Client Example

> **💡 Tip:** See [Python Client README](../../../clients/rest-http/python/README.md).

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
  "timeframe": "1h",
  "limit": 100
}
get_klines_example(kline_params)
```

**Output (Example):**

```text
Fetching k-lines for symbol: BTCINR...
API Response: {
  "statusDescription": "OK",
  "data": [
    [1612345678000, "5500000", "5600000", "5400000", "5550000", "10.5", 1612345738000]
  ],
  "statusCode": 200,
  "customMessage": ["OK"]
}
K-Lines Data: [
  [1612345678000, "5500000", "5600000", "5400000", "5550000", "10.5", 1612345738000]
]
```
