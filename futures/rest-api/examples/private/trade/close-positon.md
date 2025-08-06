# Example: Close Position

Closes an existing open position entirely using a market order.

> **💡 Tip:** For full details on endpoint parameters see the [API Reference for Close Position](../../../reference-docs/private-endpoints/trade.md#close-position).

**Endpoint:** `POST /api/v1/trade/position/close`
**Authentication:** Required (JWT or API Key/Secret)

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../reference-docs/authentication.md) for details on generating headers . The request body (including `timestamp` for API key auth) is used for signature generation.

#### Using JWT Authentication

```bash
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/position/close \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "positionId": "pos-btc-long-123",
        "symbol": "BTCUSDT"
      }'
````

#### Using API Key + Secret Authentication

```bash
# Timestamp must be included in the body for signature generation
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/position/close \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>" \
  -d '{
        "positionId": "pos-btc-long-123",
        "symbol": "BTCUSDT",
        "timestamp": <current_timestamp_ms>
      }'
```

#### Success Response (Example - Closing a Long Position)

```json
{
  "statusDescription": "Success",
  "data": {
    "clientOrderId": "closePosMarket1122",
    "datetime": "2025-04-05T13:20:00.456Z",
    "timestamp": 1712347200456,
    "symbol": "BTCUSDT",
    "type": "MARKET",
    "timeInForce": "IOC",
    "side": "SELL",
    "price": 0,
    "amount": 0.05,
    "filled": 0.05,
    "remaining": 0,
    "reduceOnly": true,
    "postOnly": false,
    "status": "filled"
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: The response details the market order created to close the position. Fields like `side` and `amount` reflect the closing order. See [ClosePositionResponseData model](../../../reference-docs/data-models.md#closepositionresponsedata).*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/http/node/README.md).

```javascript
async function closePositionExample(closeParams) {
  try {
    console.log(`Closing position ID: ${closeParams.positionId}...`);
    // Client handles authentication headers automatically
    const response = await client.closePosition(closeParams); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Close Position Response Data (Order Details):", response.data);
    } else {
      console.error("Failed to close position:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error closing position:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
const closePositionParams = {
  positionId: "pos-btc-long-123",
  symbol: "BTCUSDT" // Optional, but recommended if known
};
closePositionExample(closePositionParams);
```

**Output (Example):**

```js
// Full API response first...
Closing position ID: pos-btc-long-123...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Close Position Response Data (Order Details): { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/http/python/README.md) .

```python
import json

def close_position_example(close_params):
    try:
        print(f"Closing position ID: {close_params.get('positionId')}...")
        # Client handles authentication headers automatically
        response = client.close_position(close_params=close_params) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Close Position Response Data (Order Details): {response.get('data')}")
        else:
            print(f"Failed to close position: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error closing position: {e}")

# Example usage:
close_position_params = {
  "positionId": "pos-btc-long-123",
  "symbol": "BTCUSDT" # Optional, but recommended if known
}
close_position_example(close_position_params)
```

**Output (Example):**

```js
// Full API response first...
Closing position ID: pos-btc-long-123...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Close Position Response Data (Order Details): { // ... (data as shown in cURL example, Python format) ... }
```
