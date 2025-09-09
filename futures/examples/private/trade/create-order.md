# Example: Create Order

Places a new trading order (Market or Limit).

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Create Order](../../api-reference/private-endpoints/trade.md#create-order).

**Endpoint:** `POST /api/v1/trade/order`
**Authentication:** Required (JWT or API Key/Secret)

-----

### 1\. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../api-reference/authentication.md) for details on generating headers .

#### Using JWT Authentication (Limit Order)

```bash
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/order \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "symbol": "BTCUSDT",
        "amount": 0.01,
        "side": "BUY",
        "type": "LIMIT",
        "marginAsset": "USDT",
        "price": 65000
      }'
```

#### Using API Key + Secret Authentication (Market Order)

```bash
# Timestamp must be included in the body for signature generation
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/order \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>" \
  -d '{
        "symbol": "BTCUSDT",
        "amount": 0.005,
        "side": "SELL",
        "type": "MARKET",
        "marginAsset": "USDT",
        "timestamp": <current_timestamp_ms>
      }'
```

#### Success Response (Example - Limit Order Created)

```json
{
  "statusDescription": "Success",
  "data": {
    "clientOrderId": "myNewLimitOrder777",
    "datetime": "2025-04-09T12:20:00.123Z",
    "timestamp": 1744066800123,
    "symbol": "BTCUSDT",
    "type": "LIMIT",
    "timeInForce": "GTC",
    "side": "BUY",
    "price": 65000.00,
    "amount": 0.01,
    "filled": 0.0,
    "remaining": 0.01,
    "reduceOnly": false,
    "postOnly": false,
    "status": "new"
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [CreateOrderResponseData model](../../api-reference/data-models.md#createorderresponsedata) for field details.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/rest-http/node/README.md) .

```javascript
async function createOrderExample(orderParams) {
  try {
    console.log(`Creating ${orderParams.type} order for ${orderParams.symbol}...`);
    // Client handles authentication headers automatically
    const response = await client.createOrder(orderParams); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Create Order Response Data:", response.data);
    } else {
      console.error("Failed to create order:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error creating order:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage for a LIMIT order:
const limitOrderParams = {
  symbol: "BTCUSDT",
  amount: 0.01,
  side: "BUY",
  type: "LIMIT",
  marginAsset: "USDT",
  price: 65000
};
createOrderExample(limitOrderParams);
```

**Output (Example):**

```js
// Full API response first...
Creating LIMIT order for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Create Order Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/rest-http/python/README.md) .

```python
import json

def create_order_example(order_params):
    try:
        print(f"Creating {order_params.get('type')} order for {order_params.get('symbol')}...")
        # Client handles authentication headers automatically
        response = client.create_order(order_params=order_params) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Create Order Response Data: {response.get('data')}")
        else:
            print(f"Failed to create order: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error creating order: {e}")

# Example usage for a LIMIT order:
limit_order_params = {
  "symbol": "BTCUSDT",
  "amount": 0.01,
  "side": "BUY",
  "type": "LIMIT",
  "marginAsset": "USDT",
  "price": 65000
}
create_order_example(limit_order_params)
```

**Output (Example):**

```js
// Full API response first...
Creating LIMIT order for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Create Order Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
