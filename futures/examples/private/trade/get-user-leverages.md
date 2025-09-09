# Example: Get All User Leverages

Retrieves the user's leverage settings for all trading symbols where leverage has been configured.

> **💡 Tip:** For full details on endpoint parameters, see the [API Reference for Get All User Leverages](../../../api-reference/private-endpoints/trade.md#get-user-leverages)

**Endpoint:** `GET /api/v1/trade/userLeverages`
**Authentication:** Required (JWT or API Key/Secret)
**Query Parameters:** None

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../api-reference/authentication.md) for details on generating headers.

#### Using JWT Authentication

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/userLeverages \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
````

#### Using API Key + Secret Authentication
```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/userLeverages \
  -H "Accept: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>"
```

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": [
    {
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
    {
      "symbol": "ETHUSDT",
      "marginMode": "isolated",
      "longLeverage": 20,
      "shortLeverage": 20,
      "info": {
        "contractName": "ETHUSDT",
        "leverage": 20,
        "openPositionCount": 0
      }
    }
    // ... potentially more symbols with leverage settings
  ],
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: The response is an array of [Leverage objects](../../../api-reference/data-models.md#leverage) for each symbol configured.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/rest-http/node/README.md) .

```javascript
async function getUserLeveragesExample() {
  try {
    console.log(`Workspaceing all user leverages...`);
    // Client handles authentication headers automatically
    const response = await client.getUserLeverages(); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Get All User Leverages Response Data:", response.data);
      // Access leverage list:
      // const leverages = response.data;
      // leverages.forEach(lev => {
      //   console.log(`Symbol: ${lev.symbol}, Long: ${lev.longLeverage}x, Short: ${lev.shortLeverage}x`);
      // });
    } else {
      console.error("Failed to fetch user leverages:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching user leverages:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
getUserLeveragesExample();
```

**Output (Example):**

```js
// Full API response first...
Fetching all user leverages...
API Response: {
  "statusDescription": "Success",
  "data": [ // ... (data array as shown in cURL example) ... ],
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Get All User Leverages Response Data: [ // ... (data array as shown in cURL example) ... ]
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/rest-http/python/README.md) .

```python
import json

def get_user_leverages_example():
    try:
        print(f"Fetching all user leverages...")
        # Client handles authentication headers automatically
        response = client.get_user_leverages() #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Get All User Leverages Response Data: {response.get('data')}")
            # Access leverage list:
            # leverages = response.get('data', [])
            # for lev in leverages:
            #   print(f"Symbol: {lev.get('symbol')}, Long: {lev.get('longLeverage')}x, Short: {lev.get('shortLeverage')}x")
        else:
            print(f"Failed to fetch user leverages: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error fetching user leverages: {e}")

# Example usage:
get_user_leverages_example()
```

**Output (Example):**

```js
// Full API response first...
Fetching all user leverages...
API Response: {
  "statusDescription": "Success",
  "data": [ // ... (data array as shown in cURL example, Python format) ... ],
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Get All User Leverages Response Data: [ // ... (data array as shown in cURL example, Python format) ... ]
```
