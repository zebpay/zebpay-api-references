# Example: Cancel All Orders

Cancels all open (unfilled) orders for the authenticated user.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Cancel All Orders](../../../reference-docs/private-endpoints/trade.md#cancel-all-orders).

**Endpoint:** `DELETE /api/v1/trade/order/all`
**Authentication:** Required (JWT or API Key/Secret)

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../reference-docs/authentication.md) for details on generating headers.

#### Using JWT Authentication

```bash
curl -X DELETE https://futuresbe.zebpay.com/api/v1/trade/order/all \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Using API Key + Secret Authentication

```bash
# Timestamp must be included in the body for signature generation
curl -X DELETE https://futuresbe.zebpay.com/api/v1/trade/order/all \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>" \
  -d '{"timestamp": <current_timestamp_ms>}'
```

#### Success Response (Example)

```json
{
    "statusDescription": "OK",
    "data": [
        {
            "clientOrderId": "598d3bda315afed6f07f-370-zeb",
            "status": "canceled",
            "symbol": "BTCUSDT"
        }
    ],
    "statusCode": 200,
    "customMessage": ["OK"]
}
```

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/http/node/README.md).

```javascript
async function cancelAllOrdersExample() {
  try {
    console.log("Canceling all open orders...");
    // Client handles authentication headers automatically
    const response = await client.cancelAllOrders();
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Cancel All Orders Response Data:", response.data);
    } else {
      console.error("Failed to cancel all orders:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error canceling all orders:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
cancelAllOrdersExample();
```

**Output (Example):**

```js
// Full API response first...
Canceling all open orders...
API Response: {
  "statusDescription": "OK",
  "data": [ // ... (data as shown in cURL example) ... ],
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Cancel All Orders Response Data: [ // ... (data as shown in cURL example) ... ]
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/http/python/README.md).

```python
import json

def cancel_all_orders_example():
    try:
        print("Canceling all open orders...")
        # Client handles authentication headers automatically
        response = client.cancel_all_orders()
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Cancel All Orders Response Data: {response.get('data')}")
        else:
            print(f"Failed to cancel all orders: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error canceling all orders: {e}")

# Example usage:
cancel_all_orders_example()
```

**Output (Example):**

```js
// Full API response first...
Canceling all open orders...
API Response: {
  "statusDescription": "OK",
  "data": [ // ... (data as shown in cURL example, Python format) ... ],
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Cancel All Orders Response Data: [ // ... (data as shown in cURL example, Python format) ... ]
```
