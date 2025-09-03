# Example: Get Open Orders

Retrieves a list of the user's currently open orders, optionally filtered by symbol and pagination parameters.

> **💡 Tip:** For full details on endpoint parameters see the [API Reference for Get Open Orders](../../api-reference/private-endpoints/trade.md#get-open-orders).

**Endpoint:** `GET /api/v1/trade/order/open-orders`
**Authentication:** Required (JWT or API Key/Secret)
**Query Parameters:**

* `symbol` (`string`, required): Trading symbol to filter orders by (e.g., "BTCUSDT") .
* `limit` (`number`, optional): Maximum number of orders to return .
* `since` (`number`, optional): Fetch orders created after this Unix timestamp (ms) .

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../api-reference/authentication.md) for details on generating headers.

#### Using JWT Authentication

```bash
# Example: Get open BTCUSDT orders
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/order/open-orders?symbol=BTCUSDT&limit=10 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
````

#### Using API Key + Secret Authentication

```bash
# Example: Get open ETHUSDT orders since a specific time
# Remember to include the timestamp in the query string for signing
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/order/open-orders?symbol=ETHUSDT&since=1712300000000 \
  -H "Accept: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>"
```

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": {
    "data": [
      {
        "clientOrderId": "myOpenLimitOrder789",
        "datetime": "2025-04-05T13:18:00.000Z",
        "timestamp": 1712347080000,
        "symbol": "BTCUSDT",
        "type": "LIMIT",
        "timeInForce": "GTC",
        "side": "BUY",
        "price": 64000.00,
        "amount": 0.02,
        "filled": 0,
        "remaining": 0.02,
        "status": "new",
        "reduceOnly": false,
        "postOnly": false
      }
      // ... potentially more open orders if limit allows
    ],
    "totalCount": 1,
    "nextTimestamp": null
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [OrdersListResponse model](../../api-reference/data-models.md#orderslistresponse) and [Order model](../../api-reference/data-models.md#order) for field details.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/rest-http/node/README.md) .

```javascript
async function getOpenOrdersExample(symbol, options = {}) {
  try {
    console.log(`Workspaceing open orders for ${symbol}...`);
    // Client handles authentication headers automatically
    const response = await client.getOpenOrders(symbol, options); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Open Orders Response Data:", response.data);
      // Access the list of orders:
      // const orders = response.data.data;
      // console.log(`Found ${orders.length} open orders.`);
    } else {
      console.error("Failed to fetch open orders:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching open orders:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage: Get up to 10 open BTCUSDT orders
getOpenOrdersExample('BTCUSDT', { limit: 10 });

// Example usage: Get ETHUSDT orders since a specific time
// getOpenOrdersExample('ETHUSDT', { since: 1712300000000 });
```

**Output (Example):**

```js
// Full API response first...
Fetching open orders for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Open Orders Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/rest-http/python/README.md) .

```python
import json

def get_open_orders_example(symbol, limit=None, since=None):
    try:
        print(f"Fetching open orders for {symbol}...")
        # Client handles authentication headers automatically
        response = client.get_open_orders(symbol=symbol, limit=limit, since=since) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Open Orders Response Data: {response.get('data')}")
            # Access the list of orders:
            # orders_data = response.get('data', {})
            # orders = orders_data.get('data', [])
            # print(f"Found {len(orders)} open orders.")
        else:
            print(f"Failed to fetch open orders: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error fetching open orders: {e}")

# Example usage: Get up to 10 open BTCUSDT orders
get_open_orders_example(symbol='BTCUSDT', limit=10)

# Example usage: Get ETHUSDT orders since a specific time
# get_open_orders_example(symbol='ETHUSDT', since=1712300000000)
```

**Output (Example):**

```js
// Full API response first...
Fetching open orders for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Open Orders Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
