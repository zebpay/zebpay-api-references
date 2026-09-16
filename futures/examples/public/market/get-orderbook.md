# Example: Get Order Book

Retrieves the current order book (market depth) for a specific trading symbol.

**Endpoint:** `GET /api/v1/market/orderBook`
**Authentication:** None Required
**Parameters:**
* `symbol` (string, query, required): Trading pair in concatenated (`BTCUSDT`) or slash (`BTC/USDT`) notation.
* `limit` (integer, query, optional): Depth levels per side. Range: 1–20. Default: 20.

---

### 1. cURL Example

**Request:**

```bash
# Replace BTCUSDT with the desired symbol
curl -X GET "https://futuresbe.zebpay.com/api/v1/market/orderBook?symbol=BTCUSDT&limit=20" \
  -H "Accept: application/json"
```

**Success Response (Example):**

```json
{
  "statusDescription": "OK",
  "data": {
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
    "datetime": "2024-04-05T19:34:38.901Z",
    "nonce": null
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: `timestamp` is generated when the snapshot is transformed, `datetime` is its ISO-8601 representation, and `nonce` is currently `null`.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](../../../clients/rest-http/node/README.md) for setup instructions.

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function getOrderBookExample(symbol, limit = 20) {
  try {
    console.log(`Fetching order book for ${symbol}...`);
    // Ensure symbol is passed to the method
    const response = await client.getOrderBook(symbol, limit);
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log(`Order Book Data for ${symbol}:`, response.data);
      // Access bids/asks:
      // const bids = response.data.bids;
      // const asks = response.data.asks;
      // console.log(`Top bid: ${bids[0][0]}, Top ask: ${asks[0][0]}`);
    } else {
      console.error(`Failed to fetch order book for ${symbol}:`, response.statusDescription);
    }
  } catch (error) {
    console.error(`Error fetching order book for ${symbol}:`, error.message);
  }
}

// Example usage:
getOrderBookExample('BTCUSDT', 20);
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching order book for BTCUSDT...
API Response: {
  "statusDescription": "OK",
  "data": {
    "symbol": "BTCUSDT",
    "bids": [
      [65000.50, 0.5]
      // ... more bids
    ],
    "asks": [
      [65001.00, 0.3]
      // ... more asks
    ],
    "timestamp": 1712345678901,
    "datetime": "2024-04-05T19:34:38.901Z",
    "nonce": null
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Order Book Data for BTCUSDT: {
  "symbol": "BTCUSDT",
  "bids": [
      [65000.50, 0.5]
      // ...
    ],
    "asks": [
      [65001.00, 0.3]
      // ...
    ],
  // ... other fields
}
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](../../../clients/rest-http/python/README.md) for setup instructions.

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def get_order_book_example(symbol, limit=20):
    try:
        print(f"Fetching order book for {symbol}...")
        # Ensure symbol is passed to the method
        response = client.get_order_book(symbol=symbol, limit=limit)
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Order Book Data for {symbol}: {response.get('data')}")
            # Access bids/asks:
            # data = response.get('data', {})
            # bids = data.get('bids', [])
            # asks = data.get('asks', [])
            # if bids and asks:
            #     print(f"Top bid: {bids[0][0]}, Top ask: {asks[0][0]}")
        else:
            print(f"Failed to fetch order book for {symbol}: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching order book for {symbol}: {e}")

# Example usage:
get_order_book_example('BTCUSDT', limit=20)
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching order book for BTCUSDT...
API Response: {
  "statusDescription": "OK",
  "data": {
    "symbol": "BTCUSDT",
    "bids": [
      [
        65000.5,
        0.5
      ]
      // ... more bids
    ],
    "asks": [
      [
        65001.0,
        0.3
      ]
      // ... more asks
    ],
    "timestamp": 1712345678901,
    "datetime": "2024-04-05T19:34:38.901Z",
    "nonce": null
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Order Book Data for BTCUSDT: {'symbol': 'BTCUSDT', 'bids': [[65000.5, 0.5], ...], 'asks': [[65001.0, 0.3], ...], ...}
```
