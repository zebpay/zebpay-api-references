# Example: Edit Order

Edits an existing open order. This example changes the trigger price of a pending stop-loss or take-profit order.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Edit Order](../../../api-reference/private-endpoints/trade.md#edit-order) and the [EditOrderResponseData Data Model](../../../api-reference/data-models.md#editorderresponsedata).

**Endpoint:** `PATCH /api/v1/trade/order`
**Authentication:** Required (JWT or API Key/Secret)
**API Key Scope:** `futures:trading`

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../api-reference/authentication.md) for details on generating headers.

#### Using JWT Authentication (Modify TP/SL Trigger)

```bash
curl -X PATCH https://futuresbe.zebpay.com/api/v1/trade/order \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "clientOrderId": "7a5be049213ad0fb5e17-370-zeb",
        "triggerPrice": 7050000
      }'
```

#### Using API Key + Secret Authentication (Modify TP/SL Trigger)

```bash
API_KEY="YOUR_API_KEY"
SECRET_KEY="YOUR_SECRET_KEY"
TIMESTAMP="$(node -e 'process.stdout.write(Date.now().toString())')"
BODY="$(printf '{"clientOrderId":"7a5be049213ad0fb5e17-370-zeb","triggerPrice":7050000,"timestamp":%s}' "$TIMESTAMP")"
SIGNATURE="$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET_KEY" -hex | awk '{print $NF}')"

curl -X PATCH https://futuresbe.zebpay.com/api/v1/trade/order \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: $API_KEY" \
  -H "x-auth-signature: $SIGNATURE" \
  --data-raw "$BODY"
```

Use the TP/SL order's own `clientOrderId`, obtained from open orders or a private WebSocket order event. The signature is generated from the exact compact body sent by `curl`.

#### Success Response (Example)

```json
{
    "statusDescription": "OK",
    "data": {
        "clientOrderId": "7a5be049213ad0fb5e17-370-zeb",
        "timeInForce": "GTC",
        "triggerPrice": 7050000,
        "info": {
            "availableBalance": 150.00,
            "status": "Edit request submitted successfully",
            "lockedMargin": 0,
            "lockedMarginInMarginAsset": 0
        }
    },
    "statusCode": 200,
    "customMessage": ["OK"]
}
```

*Note: See [EditOrderResponseData model](../../../api-reference/data-models.md#editorderresponsedata) for field details. Balances are illustrative.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/rest-http/node/README.md).

```javascript
async function editOrderExample(orderParams) {
  try {
    console.log(`Editing order ID: ${orderParams.clientOrderId}...`);
    // Client handles authentication headers automatically
    const response = await client.editOrder(orderParams);
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Edit Order Response Data:", response.data);
    } else {
      console.error("Failed to edit order:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error editing order:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
const editOrderParams = {
  clientOrderId: "7a5be049213ad0fb5e17-370-zeb",
  triggerPrice: 7050000
};
editOrderExample(editOrderParams);
```

**Output (Example):**

```js
// Full API response first...
Editing order ID: 7a5be049213ad0fb5e17-370-zeb...
API Response: {
  "statusDescription": "OK",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Edit Order Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/rest-http/python/README.md).

```python
import json

def edit_order_example(order_params):
    try:
        print(f"Editing order ID: {order_params.get('clientOrderId')}...")
        # Client handles authentication headers automatically
        response = client.edit_order(order_params=order_params)
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Edit Order Response Data: {response.get('data')}")
        else:
            print(f"Failed to edit order: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error editing order: {e}")

# Example usage:
edit_order_params = {
  "clientOrderId": "7a5be049213ad0fb5e17-370-zeb",
  "triggerPrice": 7050000
}
edit_order_example(edit_order_params)
```

**Output (Example):**

```js
// Full API response first...
Editing order ID: 7a5be049213ad0fb5e17-370-zeb...
API Response: {
  "statusDescription": "OK",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Edit Order Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
