# Example: Update User Leverage

Updates the user's leverage setting for a specific trading symbol.

> **💡 Tip:** For full details on endpoint parameters, see the [API Reference for Update User Leverage](../../../../api-reference/private-endpoints/trade.md/#update-user-leverage).

**Endpoint:** `POST /api/v1/trade/update/userLeverage`
**Authentication:** Required (JWT or API Key/Secret)
**Request Body:**

* **`symbol`** (`string`, required): Trading symbol (e.g., "BTCUSDT") .
* **`leverage`** (`number`, required): The new desired leverage value (e.g., 25) .

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../../api-reference/authentication.md) for details on generating headers . The request body (including `timestamp` for API key auth) is used for signature generation.

#### Using JWT Authentication

```bash
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/update/userLeverage \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "symbol": "BTCUSDT",
        "leverage": 25
      }'
````

#### Using API Key + Secret Authentication

```bash
# Timestamp must be included in the body for signature generation
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/update/userLeverage \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>" \
  -d '{
        "symbol": "BTCUSDT",
        "leverage": 25,
        "timestamp": <current_timestamp_ms>
      }'
```

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": {
    "symbol": "BTCUSDT",
    "marginMode": "isolated",
    "longLeverage": 25,
    "shortLeverage": 25,
    "info": {
      "contractName": "BTCUSDT",
      "updatedLeverage": 25, // Note: field name might differ, e.g., 'leverage'
      "openPositionCount": 1
    }
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [Leverage model](../../../..//api-reference/data-models.md#leverage) for field details. Response reflects the newly set leverage.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../../clients/rest-http/node/README.md) .

```javascript
async function updateUserLeverageExample(leverageParams) {
  try {
    console.log(`Updating leverage for ${leverageParams.symbol} to ${leverageParams.leverage}x...`);
    // Client handles authentication headers automatically
    const response = await client.updateLeverage(leverageParams); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Update User Leverage Response Data:", response.data);
    } else {
      console.error("Failed to update user leverage:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error updating user leverage:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
const updateLeverageParams = {
  symbol: "BTCUSDT",
  leverage: 25
};
updateUserLeverageExample(updateLeverageParams);
```

**Output (Example):**

```js
// Full API response first...
Updating leverage for BTCUSDT to 25x...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Update User Leverage Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../../clients/rest-http/python/README.md) .

```python
import json

def update_user_leverage_example(leverage_params):
    try:
        print(f"Updating leverage for {leverage_params.get('symbol')} to {leverage_params.get('leverage')}x...")
        # Client handles authentication headers automatically
        response = client.update_leverage(leverage_params=leverage_params) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Update User Leverage Response Data: {response.get('data')}")
        else:
            print(f"Failed to update user leverage: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error updating user leverage: {e}")

# Example usage:
update_leverage_params = {
  "symbol": "BTCUSDT",
  "leverage": 25
}
update_user_leverage_example(update_leverage_params)
```

**Output (Example):**

```js
// Full API response first...
Updating leverage for BTCUSDT to 25x...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Update User Leverage Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
