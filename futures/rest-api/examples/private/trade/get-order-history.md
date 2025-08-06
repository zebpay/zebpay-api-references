# Example: Get Order History

Retrieves the user's historical orders (filled, canceled, etc.) with pagination support.

> **💡 Tip:** For full details on endpoint parameters, see the [API Reference for Get Order History](../../../reference-docs/private-endpoints/trade.md#get-order-history).

**Endpoint:** `GET /api/v1/trade/order/history`
**Authentication:** Required (JWT or API Key/Secret)
**Query Parameters:**

* `pageSize` (`number`, optional): Number of orders to return per page .
* `timestamp` (`number`, optional): Fetch orders created before this Unix timestamp (ms). Used for pagination; use the `nextTimestamp` value from a previous response to get the next page .

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../reference-docs/authentication.md) for details on generating headers.

#### Using JWT Authentication (First Page)

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/order/history?pageSize=20 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Using API Key + Secret Authentication

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/order/history?pageSize=20 \
  -H "Accept: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>"

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": {
    "items": [
      {
        "clientOrderId": "myMarketOrder111",
        "datetime": "2025-04-04T10:00:00.000Z",
        "timestamp": 1712240400000,
        "symbol": "BTCUSDT",
        "type": "MARKET",
        "timeInForce": "IOC",
        "side": "BUY",
        "price": 65050.00,
        "amount": 0.01,
        "filled": 0.01,
        "remaining": 0.0,
        "status": "filled",
        "reduceOnly": false,
        "postOnly": false,
        "average": 65050.00
        // ... other relevant fields
      },
      {
        "clientOrderId": "myLimitOrder222",
        "datetime": "2025-04-04T11:00:00.000Z",
        "timestamp": 1712244000000,
        "symbol": "ETHUSDT",
        "type": "LIMIT",
        "timeInForce": "GTC",
        "side": "SELL",
        "price": 3400.00,
        "amount": 0.5,
        "filled": 0.0,
        "remaining": 0.5,
        "status": "canceled",
        "reduceOnly": false,
        "postOnly": false
        // ... other relevant fields
      }
      // ... more orders up to pageSize
    ],
    "totalCount": 50,
    "nextTimestamp": 1712240399999 // Use this timestamp to query the next page
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [OrdersListResponse model](../../../reference-docs/data-models.md#orderslistresponse) and [Order model](../../../reference-docs/data-models.md#order) for field details.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/http/node/README.md) .

```javascript
async function getOrderHistoryExample(options = {}) {
  try {
    console.log(`Workspaceing order history...`);
    // Client handles authentication headers automatically
    const response = await client.getOrderHistory(options); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Order History Response Data:", response.data);
      // Access the list of orders and pagination token:
      // const orders = response.data.items;
      // const nextTimestamp = response.data.nextTimestamp;
      // console.log(`Workspaceed ${orders.length} orders. Next page timestamp: ${nextTimestamp}`);
      // if (nextTimestamp) {
      //   // Fetch next page: await getOrderHistoryExample({ pageSize: options.pageSize, timestamp: nextTimestamp });
      // }
    } else {
      console.error("Failed to fetch order history:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching order history:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage: Get first page with 20 items
getOrderHistoryExample({ pageSize: 20 });

// To fetch the next page, you would use the 'nextTimestamp' from the first response:
// getOrderHistoryExample({ pageSize: 20, timestamp: 1712240399999 }); // Example timestamp
```

**Output (Example):**

```js
// Full API response first...
Fetching order history...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Order History Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/http/python/README.md) .

```python
import json

def get_order_history_example(page_size=None, timestamp=None):
    try:
        print(f"Fetching order history...")
        # Client handles authentication headers automatically
        response = client.get_order_history(page_size=page_size, timestamp=timestamp) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Order History Response Data: {response.get('data')}")
            # Access the list of orders and pagination token:
            # orders_data = response.get('data', {})
            # orders = orders_data.get('items', [])
            # next_timestamp = orders_data.get('nextTimestamp')
            # print(f"Fetched {len(orders)} orders. Next page timestamp: {next_timestamp}")
            # if next_timestamp:
            #   # Fetch next page: get_order_history_example(page_size=page_size, timestamp=next_timestamp)
        else:
            print(f"Failed to fetch order history: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error fetching order history: {e}")

# Example usage: Get first page with 20 items
get_order_history_example(page_size=20)

# To fetch the next page, you would use the 'nextTimestamp' from the first response:
# get_order_history_example(page_size=20, timestamp=1712240399999) # Example timestamp
```

**Output (Example):**

```js
// Full API response first...
Fetching order history...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Order History Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
