# Example: Get Trade History

Retrieves the user's historical trade executions with pagination support.

> **💡 Tip:** For full details on endpoint parameters, see the [API Reference for Get Trade History](../../../api-reference/private-endpoints/trade.md#get-trade-history).

**Endpoint:** `GET /api/v1/trade/history`
**Authentication:** Required (JWT or API Key/Secret)
**Query Parameters:**

* `pageSize` (`number`, optional): Number of trades to return per page. Defaults to **10**.
* `timestamp` (`number`, optional): Pagination cursor: fetch trades executed before this Unix timestamp (ms). Use `nextTimestamp` from a previous response for the next page.
* `startTimestamp` (`number`, optional): Inclusive lower bound on trade time (ms).
* `endTimestamp` (`number`, optional): Inclusive upper bound on trade time (ms).
* `sortOrder` (`string`, optional): `"asc"` or `"desc"`. Defaults to **`desc`**.
* `symbol` (`string`, optional): Filter to a single trading symbol.

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../api-reference/authentication.md) for details on generating headers.

#### Using JWT Authentication (First Page)

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/history?pageSize=20 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Using API Key + Secret Authentication

```bash
API_KEY="YOUR_API_KEY"
SECRET_KEY="YOUR_SECRET_KEY"
TIMESTAMP="$(node -e 'process.stdout.write(Date.now().toString())')"
QUERY="pageSize=20&timestamp=$TIMESTAMP"
SIGNATURE="$(printf '%s' "$QUERY" | openssl dgst -sha256 -hmac "$SECRET_KEY" -hex | awk '{print $NF}')"

curl -X GET "https://futuresbe.zebpay.com/api/v1/trade/history?$QUERY" \
  -H "Accept: application/json" \
  -H "x-auth-apikey: $API_KEY" \
  -H "x-auth-signature: $SIGNATURE"
```

For API-key auth, sign the complete query string in the same order. Because this endpoint also uses `timestamp` as its pagination cursor, use JWT auth when requesting a cursor older than the authentication timestamp window.

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": {
    "items": [
      {
        "id": "trade123",
        "timestamp": 1712240400500,
        "datetime": "2025-04-04T10:00:00.500Z",
        "symbol": "BTCUSDT",
        "order": "orderLink111",
        "type": "market",
        "side": "buy",
        "takerOrMaker": "taker",
        "price": 65050.00,
        "amount": 0.01,
        "cost": 650.50,
        "fee": {
          "cost": 0.6505,
          "currency": "USDT"
        },
        "info": {
          /* raw exchange data */
        }
      }
      // ... more trades up to pageSize
    ],
    "totalCount": 120,
    "nextTimestamp": 1712240400499 // Use this timestamp to query the next page
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [TradesListResponse model](../../../api-reference/data-models.md#tradeslistresponse) and [Trade model](../../../api-reference/data-models.md#trade) for field details.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/rest-http/node/README.md) .

```javascript
async function getTradeHistoryExample(options = {}) {
  try {
    console.log(`Workspaceing trade history...`);
    // Client handles authentication headers automatically
    const response = await client.getTradeHistory(options); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Trade History Response Data:", response.data);
      // Access the list of trades and pagination token:
      // const trades = response.data.items;
      // const nextTimestamp = response.data.nextTimestamp;
      // console.log(`Workspaceed ${trades.length} trades. Next page timestamp: ${nextTimestamp}`);
      // if (nextTimestamp) {
      //   // Fetch next page: await getTradeHistoryExample({ pageSize: options.pageSize, timestamp: nextTimestamp });
      // }
    } else {
      console.error("Failed to fetch trade history:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching trade history:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage: Get first page with 20 items
getTradeHistoryExample({ pageSize: 20 });

// To fetch the next page, you would use the 'nextTimestamp' from the first response:
// getTradeHistoryExample({ pageSize: 20, timestamp: 1712240400499 }); // Example timestamp
```

**Output (Example):**

```js
// Full API response first...
Fetching trade history...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (items as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Trade History Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/rest-http/python/README.md) .

```python
import json

def get_trade_history_example(page_size=None, timestamp=None):
    try:
        print(f"Fetching trade history...")
        # Client handles authentication headers automatically
        response = client.get_trade_history(page_size=page_size, timestamp=timestamp) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Trade History Response Data: {response.get('data')}")
            # Access the list of trades and pagination token:
            # trades_data = response.get('data', {})
            # trades = trades_data.get('items', [])
            # next_timestamp = trades_data.get('nextTimestamp')
            # print(f"Fetched {len(trades)} trades. Next page timestamp: {next_timestamp}")
            # if next_timestamp:
            #   # Fetch next page: get_trade_history_example(page_size=page_size, timestamp=next_timestamp)
        else:
            print(f"Failed to fetch trade history: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error fetching trade history: {e}")

# Example usage: Get first page with 20 items
get_trade_history_example(page_size=20)

# To fetch the next page, you would use the 'nextTimestamp' from the first response:
# get_trade_history_example(page_size=20, timestamp=1712240400499) # Example timestamp
```

**Output (Example):**

```js
// Full API response first...
Fetching trade history...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Trade History Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
