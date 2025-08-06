# Example: Add TP/SL to Position

Adds Take Profit (TP) and/or Stop Loss (SL) orders to an existing open position.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Details](../../../reference-docs/private-endpoints/trade.md#add-tpsl).

**Endpoint:** `POST /api/v1/trade/order/addTPSL`
**Authentication:** Required (JWT or API Key/Secret)

-----

### 1\. cURL Example

> **💡 Tip:** See the [invalid URL removed] for details on generating headers . The request body (including `timestamp` for API key auth) is used for signature generation.

#### Using JWT Authentication (Adding Take Profit)

```bash
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/order/addTPSL \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "positionId": "pos-btc-long-123",
        "amount": 0.05,
        "side": "SELL",
        "symbol": "BTCUSDT",
        "takeProfitPrice": 67000
      }'
```

#### Using API Key + Secret Authentication (Adding Stop Loss)

```bash
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/order/addTPSL \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>" \
  -d '{
        "positionId": "pos-eth-short-456",
        "amount": 0.2,
        "side": "BUY",
        "symbol": "ETHUSDT",
        "stopLossPrice": 3400,
      }'
```

#### Success Response (Example - Take Profit Order Created)

```json
{
  "statusDescription": "Success",
  "data": {
    "clientOrderId": "tpOrder789",
    "datetime": "2025-04-05T13:15:00.987Z",
    "timestamp": 1712346900987,
    "symbol": "BTCUSDT",
    "type": "TAKE_PROFIT_MARKET",
    "timeInForce": "GTC",
    "side": "SELL",
    "price": 67000.00,
    "amount": 0.05,
    "filled": 0.0,
    "remaining": 0.05,
    "reduceOnly": true,
    "postOnly": false,
    "status": "new"
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [AddTPSLResponseData model](../../../reference-docs/data-models.md#addtpslresponsedata) (aliased to CreateOrderResponseData) for field details.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/http/node/README.md) .

```javascript
async function addTPSLOrderExample(tpslParams) {
  try {
    const type = tpslParams.takeProfitPrice ? 'Take Profit' : 'Stop Loss';
    console.log(`Adding ${type} order for position ID: ${tpslParams.positionId}...`);
    // Client handles authentication headers automatically
    const response = await client.addTPSLOrder(tpslParams); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Add TP/SL Order Response Data:", response.data);
    } else {
      console.error("Failed to add TP/SL order:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error adding TP/SL order:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage for adding Take Profit:
const tpParams = {
  positionId: "pos-btc-long-123",
  amount: 0.05,
  side: "SELL", // Side to close the long position
  symbol: "BTCUSDT",
  takeProfitPrice": 67000
};
addTPSLOrderExample(tpParams);

// Example usage for adding Stop Loss:
/*
const slParams = {
  positionId: "pos-eth-short-456",
  amount": 0.2,
  side: "BUY", // Side to close the short position
  symbol: "ETHUSDT",
  stopLossPrice: 3400
};
addTPSLOrderExample(slParams);
*/
```

**Output (Example for Take Profit):**

```js
// Full API response first...
Adding Take Profit order for position ID: pos-btc-long-123...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Add TP/SL Order Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/http/python/README.md) .

```python
import json

def add_tpsl_order_example(tpsl_params):
    try:
        order_type = 'Take Profit' if 'takeProfitPrice' in tpsl_params else 'Stop Loss'
        print(f"Adding {order_type} order for position ID: {tpsl_params.get('positionId')}...")
        # Client handles authentication headers automatically
        response = client.add_tpsl_order(tpsl_params=tpsl_params) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Add TP/SL Order Response Data: {response.get('data')}")
        else:
            print(f"Failed to add TP/SL order: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error adding TP/SL order: {e}")

# Example usage for adding Take Profit:
tp_params = {
  "positionId": "pos-btc-long-123",
  "amount": 0.05,
  "side": "SELL", # Side to close the long position
  "symbol": "BTCUSDT",
  "takeProfitPrice": 67000
}
add_tpsl_order_example(tp_params)

# Example usage for adding Stop Loss:
# sl_params = {
#   "positionId": "pos-eth-short-456",
#   "amount": 0.2,
#   "side": "BUY", # Side to close the short position
#   "symbol": "ETHUSDT",
#   "stopLossPrice": 3400
# }
# add_tpsl_order_example(sl_params)

```

**Output (Example for Take Profit):**

```js
// Full API response first...
Adding Take Profit order for position ID: pos-btc-long-123...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Add TP/SL Order Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
