# Example: Cancel Order

Cancels an existing open order using its `clientOrderId`.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Cancel Order](../../api-reference/private-endpoints/trade.md#cancel-order).

**Endpoint:** `DELETE /api/v1/trade/order`
**Authentication:** Required (JWT or API Key/Secret)

-----

### 1\. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../api-reference/authentication.md) for details on generating headers.

#### Using JWT Authentication

```bash
curl -X DELETE https://futuresbe.zebpay.com/api/v1/trade/order \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "clientOrderId": "myLimitOrder456",
        "symbol": "BTCUSDT"
      }'
```

#### Using API Key + Secret Authentication

```bash
curl -X DELETE https://futuresbe.zebpay.com/api/v1/trade/order \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>" \
  -d '{
        "clientOrderId": "myLimitOrder456",
        "symbol": "BTCUSDT",
      }'
```

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": {
    "clientOrderId": "myLimitOrder456",
    "status": "canceled",
    "symbol": "BTCUSDT",
    "info": {
      "clientOrderId": "myLimitOrder456",
      "orderId": 987654321,
      "status": "CANCELED",
      "success": true
    }
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [CancelOrderResponseData model](../../api-reference/data-models.md#cancelorderresponsedata) for field details.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/rest-http/node/README.md) .

```javascript
async function cancelOrderExample(cancelParams) {
  try {
    console.log(`Canceling order with Client ID: ${cancelParams.clientOrderId}...`);
    // Client handles authentication headers automatically
    const response = await client.cancelOrder(cancelParams); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Cancel Order Response Data:", response.data);
    } else {
      console.error("Failed to cancel order:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error canceling order:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
const cancelOrderParams = {
  clientOrderId: "myLimitOrder456",
  symbol: "BTCUSDT" // Optional, but recommended if known
};
cancelOrderExample(cancelOrderParams);
```

**Output (Example):**

```js
// Full API response first...
Canceling order with Client ID: myLimitOrder456...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Cancel Order Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/rest-http/python/README.md) .

```python
import json

def cancel_order_example(cancel_params):
    try:
        print(f"Canceling order with Client ID: {cancel_params.get('clientOrderId')}...")
        # Client handles authentication headers automatically
        response = client.cancel_order(cancel_params=cancel_params) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Cancel Order Response Data: {response.get('data')}")
        else:
            print(f"Failed to cancel order: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error canceling order: {e}")

# Example usage:
cancel_order_params = {
  "clientOrderId": "myLimitOrder456",
  "symbol": "BTCUSDT" # Optional, but recommended if known
}
cancel_order_example(cancel_order_params)
```

**Output (Example):**

```js
// Full API response first...
Canceling order with Client ID: myLimitOrder456...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Cancel Order Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
