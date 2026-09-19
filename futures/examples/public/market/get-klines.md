# Example: Get K-Lines (OHLCV Data)

Retrieves historical candlestick data (Open, High, Low, Close, Volume) for a specified trading symbol and timeframe.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Get K-Lines](../../../api-reference/public-endpoints/market.md#get-klines).

**Endpoint:** `POST /api/v1/market/klines`
**Authentication:** Not Required
**Parameters:**
* `symbol` (string, body, required): Trading pair (e.g. `"BTCINR"`).
* `timeframe` (string, body, optional): Candlestick interval. Allowed: `1m`, `3m`, `5m`, `15m`, `30m`, `1h`, `2h`, `4h`, `6h`, `8h`, `12h`, `1d`, `1w`, `1M`. Defaults to `1m`.
* `since` (number, body, optional): Start time in milliseconds since epoch.
* `until` (number, body, optional): Inclusive end time in milliseconds since epoch. Requires `since`.
* `limit` (number, body, optional): Maximum candles to return (`1`–`1000`, default `1000`).
* `priceType` (string, query, optional): `LTP` (default) or `MARK_PRICE`.

Send `timeframe`, `since`, and `until` in the JSON body. Do not send `interval`, `startTime`, or `endTime`. If `since` is omitted, the response is the latest `limit` candles.

---

### 1. cURL Example

**Latest candles:**

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

**Bounded window (`since` / `until` and mark price):**

```bash
curl -X POST "https://futuresbe.zebpay.com/api/v1/market/klines?priceType=MARK_PRICE" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTCINR",
    "timeframe": "1h",
    "since": 1712340000000,
    "until": 1712343600000,
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
      1612345737999
    ]
  ],
  "statusCode": 201,
  "customMessage": ["OK"]
}
```
*Note: Success uses HTTP `201` with `statusCode: 201`. Each candle is `[startTime, open, high, low, close, volume, endTime]`. For `priceType=MARK_PRICE`, `volume` may be `null`.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** See [Node.js Client README](../../../clients/rest-http/node/README.md).

```javascript
async function getKlinesExample(klineParams) {
  try {
    console.log(`Fetching k-lines for symbol: ${klineParams.symbol}...`);
    const response = await client.getKlines(klineParams);
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
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

// Example usage. `interval` is an alias for `timeframe`; `until` requires `since` (or `startTime`).
const klineParams = {
  symbol: "BTCINR",
  timeframe: "1h",
  since: 1712340000000,
  until: 1712343600000,
  limit: 100,
  priceType: "LTP"
};
getKlinesExample(klineParams);
```

**Output (Example):**

```js
// Full API response first...
Fetching k-lines for symbol: BTCINR...
API Response: {
  "statusDescription": "OK",
  "data": [
    [1612345678000, "5500000", "5600000", "5400000", "5550000", "10.5", 1612345737999]
  ],
  "statusCode": 201,
  "customMessage": ["OK"]
}
// Extracted data...
K-Lines Data: [
  [1612345678000, "5500000", "5600000", "5400000", "5550000", "10.5", 1612345737999]
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

        if response and response.get("statusCode") in [200, 201]:
            print(f"K-Lines Data: {response.get('data')}")
        else:
            print(f"Failed to fetch k-lines: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error fetching k-lines: {e}")

# Example usage. `interval` is an alias for `timeframe`; `until` requires `since` (or `startTime`).
kline_params = {
  "symbol": "BTCINR",
  "timeframe": "1h",
  "since": 1712340000000,
  "until": 1712343600000,
  "limit": 100,
  "priceType": "LTP"
}
get_klines_example(kline_params)
```

**Output (Example):**

```js
// Full API response first...
Fetching k-lines for symbol: BTCINR...
API Response: {
  "statusDescription": "OK",
  "data": [
    [1612345678000, "5500000", "5600000", "5400000", "5550000", "10.5", 1612345737999]
  ],
  "statusCode": 201,
  "customMessage": ["OK"]
}
// Extracted data...
K-Lines Data: [
  [1612345678000, "5500000", "5600000", "5400000", "5550000", "10.5", 1612345737999]
]
```
