# Example: Get Order Details

Fetches details of a specific order using its client order ID.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Details](../../../reference-docs/private-endpoints/trade.md#get-order).

**Endpoint:** `GET /api/v1/trade/order`
**Authentication:** Required (JWT or API Key/Secret)
**Query Parameters:**

  * `id` (string, required): The client-generated ID of the order to fetch .

-----

### 1\. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../reference-docs/authentication.md) for details on generating headers.

#### Using JWT Authentication

```bash
# Replace 'myLimitOrder456' with the actual clientOrderId
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/order?id=myLimitOrder456 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Using API Key + Secret Authentication

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/order?id=myLimitOrder456 \
  -H "Accept: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>"
```

#### Success Response (Example - Canceled Order)

```js
{
  "statusDescription": "Success",
  "data": {
    "clientOrderId": "myLimitOrder456",
    "datetime": "2025-04-05T13:05:00.000Z",
    "timestamp": 1712346300000,
    "symbol": "BTCUSDT",
    "type": "LIMIT",
    "timeInForce": "GTC",
    "side": "SELL",
    "price": 66000.00,
    "amount": 0.1,
    "filled": 0.0,
    "remaining": 0.1,
    "status": "canceled",
    "reduceOnly": false,
    "postOnly": false,
    "average": null,
    "trades": [],
    "info": { /* raw exchange data */ }
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [Order model](../../../reference-docs/data-models.#order) for field details.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/http/node/README.md) .

```javascript
async function getOrderExample(clientOrderId) {
  try {
    console.log(`Workspaceing order details for Client ID: ${clientOrderId}...`);
    // Client handles authentication headers automatically
    const response = await client.getOrder(clientOrderId); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Get Order Response Data:", response.data);
    } else {
      console.error("Failed to get order details:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error getting order details:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
const orderIdToFetch = "myLimitOrder456";
getOrderExample(orderIdToFetch);
```

**Output (Example):**

```js
// Full API response first...
Fetching order details for Client ID: myLimitOrder456...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Get Order Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/http/python/README.md) .

```python
import json

def get_order_example(client_order_id):
    try:
        print(f"Fetching order details for Client ID: {client_order_id}...")
        # Client handles authentication headers automatically
        response = client.get_order(client_order_id=client_order_id) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Get Order Response Data: {response.get('data')}")
        else:
            print(f"Failed to get order details: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error getting order details: {e}")

# Example usage:
order_id_to_fetch = "myLimitOrder456"
get_order_example(order_id_to_fetch)
```

**Output (Example):**

```js
// Full API response first...
Fetching order details for Client ID: myLimitOrder456...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Get Order Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
