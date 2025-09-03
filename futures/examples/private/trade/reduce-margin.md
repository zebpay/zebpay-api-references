# Example: Reduce Margin from Position

Reduces margin from an existing isolated margin position. This can free up collateral but may increase the risk of liquidation.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Reduce Margin](../../api-reference/private-endpoints/trade.md#reduce-margin) and the [MarginResponse Data Model](../../api-reference/data-models.md#marginresponse).

**Endpoint:** `POST /api/v1/trade/reduceMargin`
**Authentication:** Required (JWT or API Key/Secret)

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../api-reference/authentication.md) for details on generating headers.

#### Using JWT Authentication

```bash
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/reduceMargin \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "positionId": "pos-btc-long-123",
        "amount": 50.0,
        "symbol": "BTCUSDT"
      }'
````

#### Using API Key + Secret Authentication

```bash
# Timestamp must be included in the body for signature generation
curl -X POST https://futuresbe.zebpay.com/api/v1/trade/reduceMargin \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>" \
  -d '{
        "positionId": "pos-btc-long-123",
        "amount": 50.0,
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
      "lockedBalance": 375.50,
      "withdrawableBalance": 8450.00,
      "asset": "USDT",
      "message": "Margin reduced successfully"
    },
    "type": "reduce",
    "amount": 50.0,
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

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/rest-http/node/README.md) .

```javascript
async function reduceMarginExample(marginParams) {
  try {
    console.log(`Reducing ${marginParams.amount} margin from position ID: ${marginParams.positionId}...`);
    // Client handles authentication headers automatically
    const response = await client.reduceMargin(marginParams); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Reduce Margin Response Data:", response.data);
    } else {
      console.error("Failed to reduce margin:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error reducing margin:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
const reduceMarginParams = {
  positionId: "pos-btc-long-123",
  amount: 50.0,
  symbol: "BTCUSDT" // Optional, but recommended if known
};
reduceMarginExample(reduceMarginParams);
```

**Output (Example):**

```js
// Full API response first...
Reducing 50 margin from position ID: pos-btc-long-123...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Reduce Margin Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/rest-http/python/README.md) .

```python
import json

def reduce_margin_example(margin_params):
    try:
        print(f"Reducing {margin_params.get('amount')} margin from position ID: {margin_params.get('positionId')}...")
        # Client handles authentication headers automatically
        response = client.reduce_margin(margin_params=margin_params) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Reduce Margin Response Data: {response.get('data')}")
        else:
            print(f"Failed to reduce margin: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error reducing margin: {e}")

# Example usage:
reduce_margin_params = {
  "positionId": "pos-btc-long-123",
  "amount": 50.0,
  "symbol": "BTCUSDT" # Optional, but recommended if known
}
reduce_margin_example(reduce_margin_params)
```

**Output (Example):**

```js
// Full API response first...
Reducing 50.0 margin from position ID: pos-btc-long-123...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Reduce Margin Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
