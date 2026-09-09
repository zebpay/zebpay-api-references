# Example: Create Order

Places a market, limit, stop-market, or stop-limit order.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Create Order](../../../api-reference/private-endpoints/trade.md#create-order).

**Endpoint:** `POST /api/v1/trade/order`
**Authentication:** Required (JWT or API Key/Secret)
**API Key Scope:** `futures:trading`

-----

### 1\. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../api-reference/authentication.md) for details on generating headers .

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

#### Using API Key + Secret Authentication (STOP_MARKET Order)

```bash
API_KEY="YOUR_API_KEY"
SECRET_KEY="YOUR_SECRET_KEY"
TIMESTAMP="$(node -e 'process.stdout.write(Date.now().toString())')"
BODY="$(printf '{"symbol":"BTCUSDT","amount":0.005,"side":"BUY","type":"STOP_MARKET","triggerPrice":65500,"timestamp":%s}' "$TIMESTAMP")"
SIGNATURE="$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET_KEY" -hex | awk '{print $NF}')"

curl -X POST https://futuresbe.zebpay.com/api/v1/trade/order \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: $API_KEY" \
  -H "x-auth-signature: $SIGNATURE" \
  --data-raw "$BODY"
```

`STOP_MARKET` requires `triggerPrice` and does not use `price`. The signature is generated from the exact compact body sent by `curl`.

#### Using API Key + Secret Authentication (STOP_LIMIT Bracket Order)

```bash
API_KEY="YOUR_API_KEY"
SECRET_KEY="YOUR_SECRET_KEY"
TIMESTAMP="$(node -e 'process.stdout.write(Date.now().toString())')"
BODY="$(printf '{"symbol":"BTCUSDT","amount":0.005,"side":"BUY","type":"STOP_LIMIT","price":66000,"triggerPrice":65500,"stopLossPrice":63000,"takeProfitPrice":70000,"timestamp":%s}' "$TIMESTAMP")"
SIGNATURE="$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET_KEY" -hex | awk '{print $NF}')"

curl -X POST https://futuresbe.zebpay.com/api/v1/trade/order \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: $API_KEY" \
  -H "x-auth-signature: $SIGNATURE" \
  --data-raw "$BODY"
```

The signature is generated from the exact compact body sent by `curl`. The symbol must list `STOP_LIMIT` in Exchange Info. The entry activates at `triggerPrice`; `stopLossPrice` and `takeProfitPrice` configure protection for the resulting position. Either bracket field may be omitted, or both may be supplied.

#### Success Response (Example - STOP_LIMIT Entry Created)

```json
{
  "statusDescription": "Success",
  "data": {
    "clientOrderId": "myStopLimitOrder777",
    "datetime": "2025-04-09T12:20:00.123Z",
    "timestamp": 1744066800123,
    "symbol": "BTCUSDT",
    "type": "stop_limit",
    "timeInForce": "GTC",
    "side": "buy",
    "price": 66000.00,
    "triggerPrice": 65500.00,
    "amount": 0.005,
    "filled": 0.0,
    "remaining": 0.005,
    "reduceOnly": false,
    "postOnly": false,
    "status": "new"
  },
  "statusCode": 201,
  "customMessage": ["OK"]
}
```

*Note: See [CreateOrderResponseData model](../../../api-reference/data-models.md#createorderresponsedata) for field details.*

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

// Example usage for a STOP_LIMIT order:
const stopLimitOrderParams = {
  symbol: "BTCUSDT",
  amount: 0.01,
  side: "BUY",
  type: "STOP_LIMIT",
  price: 66000,
  triggerPrice: 65500,
  stopLossPrice: 63000,
  takeProfitPrice: 70000
};
createOrderExample(stopLimitOrderParams);
```

**Output (Example):**

```js
// Full API response first...
Creating STOP_LIMIT order for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 201, "customMessage": ["OK"] }
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

# Example usage for a STOP_MARKET order:
stop_market_order_params = {
  "symbol": "BTCUSDT",
  "amount": 0.01,
  "side": "SELL",
  "type": "STOP_MARKET",
  "triggerPrice": 62000
}
create_order_example(stop_market_order_params)
```

**Output (Example):**

```js
// Full API response first...
Creating STOP_MARKET order for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 201, "customMessage": ["OK"] }
// Extracted data...
Create Order Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
