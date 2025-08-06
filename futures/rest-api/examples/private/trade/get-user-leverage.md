# Example: Get User Leverage (Single Symbol)

Retrieves the user's current leverage setting for a specific trading symbol.

> **💡 Tip:** For full details on endpoint parameters, see the [API Reference for Get User Leverage](../../../reference-docs/private-endpoints/trade.md).

**Endpoint:** `GET /api/v1/trade/userLeverage`
**Authentication:** Required (JWT or API Key/Secret)
**Query Parameters:**

* `symbol` (`string`, required): Trading symbol to get leverage for (e.g., "BTCUSDT") .

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../reference-docs/authentication.md) for details on generating headers . For API Key auth, the query string (including `timestamp`) is used for signature generation.

#### Using JWT Authentication

```bash
# Replace BTCUSDT with the desired symbol
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/userLeverage?symbol=BTCUSDT \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
````

#### Using API Key + Secret Authentication

```bash
curl -X GET "[https://futuresbe.zebpay.com/api/v1/trade/userLeverage?symbol=BTCUSDT&timestamp=](https://futuresbe.zebpay.com/api/v1/trade/userLeverage?symbol=BTCUSDT \
  -H "Accept: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>"
```

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": {
    "symbol": "BTCUSDT",
    "marginMode": "isolated",
    "longLeverage": 10,
    "shortLeverage": 10,
    "info": {
      "contractName": "BTCUSDT",
      "leverage": 10,
      "openPositionCount": 1
    }
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [Leverage model](../../../reference-docs/data-models.md#leverage) for field details. Leverage value and margin mode reflect user settings.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/http/node/README.md) .

```javascript
async function getUserLeverageExample(symbol) {
  try {
    console.log(`Workspaceing user leverage for ${symbol}...`);
    // Client handles authentication headers automatically
    const response = await client.getUserLeverage(symbol); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Get User Leverage Response Data:", response.data);
      // Access leverage values:
      // const leverageData = response.data;
      // console.log(`Long Leverage: ${leverageData.longLeverage}, Short Leverage: ${leverageData.shortLeverage}`);
    } else {
      console.error("Failed to fetch user leverage:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching user leverage:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
getUserLeverageExample('BTCUSDT');
```

**Output (Example):**

```js
// Full API response first...
Fetching user leverage for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Get User Leverage Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/http/python/README.md) .

```python
import json

def get_user_leverage_example(symbol):
    try:
        print(f"Fetching user leverage for {symbol}...")
        # Client handles authentication headers automatically
        response = client.get_user_leverage(symbol=symbol) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Get User Leverage Response Data: {response.get('data')}")
            # Access leverage values:
            # leverage_data = response.get('data', {})
            # print(f"Long Leverage: {leverage_data.get('longLeverage')}, Short Leverage: {leverage_data.get('shortLeverage')}")
        else:
            print(f"Failed to fetch user leverage: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error fetching user leverage: {e}")

# Example usage:
get_user_leverage_example(symbol='BTCUSDT')
```

**Output (Example):**

```js
// Full API response first...
Fetching user leverage for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Get User Leverage Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
