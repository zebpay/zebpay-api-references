# Example: Add Margin to Position

Adds margin to an existing isolated margin position. This can help lower the liquidation price for the position.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Add Margin](../../api-reference/private-endpoints/trade.md#add-margin) and the [MarginResponse Data Model](../../api-reference/data-models.md#marginresponse).

**Endpoint:** `POST /api/v1/trade/addMargin`
**Authentication:** Required (JWT or API Key/Secret)

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../api-reference/authentication.md) for details on generating headers.

#### Using JWT Authentication

```bash
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/addMargin \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "positionId": "pos-btc-long-123",
        "amount": 100.0,
        "symbol": "BTCUSDT"
      }'
````

#### Using API Key + Secret Authentication

```bash
# Timestamp must be included in the body for signature generation
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/addMargin \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>" \
  -d '{
        "positionId": "pos-btc-long-123",
        "amount": 100.0,
        "symbol": "BTCUSDT",
        "timestamp": <current_timestamp_ms>
      }'
```

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": {
    "info": {
      "lockedBalance": 425.50,
      "withdrawableBalance": 8400.00,
      "asset": "USDT",
      "message": "Margin added successfully"
    },
    "type": "add",
    "amount": 100.0,
    "code": "USDT",
    "symbol": "BTCUSDT",
    "status": "ok"
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [MarginResponse model](../../api-reference/data-models.md#marginresponse) for field details. Balances are illustrative.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../clients/rest-http/node/README.md).

```javascript
async function addMarginExample(marginParams) {
  try {
    console.log(`Adding ${marginParams.amount} margin to position ID: ${marginParams.positionId}...`);
    // Client handles authentication headers automatically
    const response = await client.addMargin(marginParams); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Add Margin Response Data:", response.data);
    } else {
      console.error("Failed to add margin:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error adding margin:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
const addMarginParams = {
  positionId: "pos-btc-long-123",
  amount: 100.0,
  symbol: "BTCUSDT" // Optional, but recommended if known
};
addMarginExample(addMarginParams);
```

**Output (Example):**

```js
// Full API response first...
Adding 100 margin to position ID: pos-btc-long-123...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Add Margin Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../clients/rest-http/python/README.md).

```python
import json

def add_margin_example(margin_params):
    try:
        print(f"Adding {margin_params.get('amount')} margin to position ID: {margin_params.get('positionId')}...")
        # Client handles authentication headers automatically
        response = client.add_margin(margin_params=margin_params) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Add Margin Response Data: {response.get('data')}")
        else:
            print(f"Failed to add margin: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error adding margin: {e}")

# Example usage:
add_margin_params = {
  "positionId": "pos-btc-long-123",
  "amount": 100.0,
  "symbol": "BTCUSDT" # Optional, but recommended if known
}
add_margin_example(add_margin_params)
```

**Output (Example):**

```js
// Full API response first...
Adding 100.0 margin to position ID: pos-btc-long-123...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Add Margin Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
