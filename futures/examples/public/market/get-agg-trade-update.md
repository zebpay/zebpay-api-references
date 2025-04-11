# Example: Get Aggregate Trades

Retrieves recent aggregate trades (trades at the same price level) for a specific trading symbol.

**Endpoint:** `GET /api/v1/market/aggTrade` [cite: futures/clients/rest-http/node/utils/config.js, futures/clients/rest-http/python/utils/config.py]
**Authentication:** None Required [cite: futures/api-reference/public-endpoints/market.md]
**Parameters:**
* `symbol` (string, query, required): The trading symbol (e.g., "BTCINR") [cite: futures/api-reference/public-endpoints/market.md].

---

### 1. cURL Example

**Request:**

```bash
# Replace BTCINR with the desired symbol
curl -X GET https://futuresbe.zebpay.com/api/v1/market/aggTrade?symbol=BTCINR \
  -H "Accept: application/json"
```

**Success Response (Example):**

```json
{
  "statusDescription": "Success",
  "data": [
    {
      "aggregateTradeId": 543210,
      "symbol": "BTCINR",
      "price": "5500000.00",
      "quantity": "0.005",
      "firstTradeId": 98765,
      "lastTradeId": 98767,
      "tradeTime": 1712345000123,
      "isBuyerMarketMaker": false
    },
    {
      "aggregateTradeId": 543211,
      "symbol": "BTCINR",
      "price": "5500100.00",
      "quantity": "0.010",
      "firstTradeId": 98768,
      "lastTradeId": 98769,
      "tradeTime": 1712345005456,
      "isBuyerMarketMaker": true
    }
    // ... potentially more aggregate trades
  ],
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: Values will reflect live market data.* [cite: futures/api-reference/public-endpoints/market.md, futures/api-reference/data-models.md]

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](futures/clients/rest-http/node/README.md) for setup instructions [cite: futures/clients/rest-http/node/README.md].

Assumes you have initialized the `FuturesApiClient` as `client`. [cite: futures/clients/rest-http/node/run.example.js]

**Request:**

```javascript
async function getAggTradeExample(symbol) {
  try {
    console.log(`Workspaceing aggregate trades for ${symbol}...`);
    // Ensure symbol is passed to the method
    const response = await client.getAggTrade(symbol); // [cite: futures/clients/rest-http/node/client.js]
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log(`Aggregate Trades Data for ${symbol}:`, response.data);
      // Access the first trade:
      // const firstTrade = response.data[0];
      // if (firstTrade) {
      //   console.log(`First Agg Trade Price: ${firstTrade.price}, Qty: ${firstTrade.quantity}`);
      // }
    } else {
      console.error(`Failed to fetch aggregate trades for ${symbol}:`, response.statusDescription);
    }
  } catch (error) {
    console.error(`Error fetching aggregate trades for ${symbol}:`, error.message);
  }
}

// Example usage:
getAggTradeExample('BTCINR');
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching aggregate trades for BTCINR...
API Response: {
  "statusDescription": "Success",
  "data": [
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
    // ... more trades
  ],
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Aggregate Trades Data for BTCINR: [
  {
    "aggregateTradeId": 543210,
    // ... other fields ...
  }
  // ...
]
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](futures/clients/rest-http/python/README.md) for setup instructions [cite: futures/clients/rest-http/python/README.md].

Assumes you have initialized the `FuturesApiClient` as `client`. [cite: futures/clients/rest-http/python/run_example.py]

**Request:**

```python
import json

def get_agg_trade_example(symbol):
    try:
        print(f"Fetching aggregate trades for {symbol}...")
        # Ensure symbol is passed to the method
        response = client.get_agg_trade(symbol=symbol) # [cite: futures/clients/rest-http/python/client/client.py]
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Aggregate Trades Data for {symbol}: {response.get('data')}")
            # Access the first trade:
            # data = response.get('data', [])
            # if data:
            #     first_trade = data[0]
            #     print(f"First Agg Trade Price: {first_trade.get('price')}, Qty: {first_trade.get('quantity')}")
        else:
            print(f"Failed to fetch aggregate trades for {symbol}: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching aggregate trades for {symbol}: {e}")

# Example usage:
get_agg_trade_example('BTCINR')
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching aggregate trades for BTCINR...
API Response: {
  "statusDescription": "Success",
  "data": [
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
    // ... more trades
  ],
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Aggregate Trades Data for BTCINR: [{'aggregateTradeId': 543210, ...}, ...]
```
