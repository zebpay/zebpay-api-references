# Example: Get Wallet Balance

Retrieves the user's balances for all assets in their futures wallet.

**Endpoint:** `GET /api/v1/wallet/balance`
**Authentication:** Required (JWT or API Key/Secret)
**Parameters:** None

---

### 1. cURL Example

> **💡 Tip:** Manual authentication requires careful construction of headers. For detailed steps on obtaining a JWT or generating an API Key signature, please refer to the [Authentication Guide](../../api-reference/authentication.md) .

#### Method 1: Using JWT Authentication

**Request:**

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/wallet/balance \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```


#### Method 2: Using API Key + Secret Authentication

**Request:**

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/wallet/balance \
  -H "Accept: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>"
```


**Success Response (Example):**

```json
{
  "statusDescription": "Success",
  "data": {
    "USDT": {
      "total": 10000.50,
      "free": 8500.25,
      "used": 1500.25
    },
    "BTC": {
      "total": 0.5,
      "free": 0.2,
      "used": 0.3
    }
    // ... balances for other assets held
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: The assets and values shown will reflect the user's actual wallet balance.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and **initialized the client with valid authentication credentials** (JWT or API Key/Secret) first. See the [Node.js Client README](futures/clients/rest-http/node/README.md) and the [Authentication Guide](../../api-reference/authentication.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client` with proper authentication.

**Request:**

```javascript
async function getBalanceExample() {
  try {
    console.log("Fetching wallet balance...");
    // The client handles adding authentication headers automatically
    const response = await client.getBalance(); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Wallet Balance Data:", response.data);
      // Access specific asset balance:
      // const usdtBalance = response.data.USDT;
      // if (usdtBalance) {
      //   console.log(`USDT Free Balance: ${usdtBalance.free}`);
      // }
    } else {
      console.error("Failed to fetch wallet balance:", response.statusDescription);
    }
  } catch (error) {
    // Handle potential auth errors (401) or other issues
    console.error("Error fetching wallet balance:", error.message);
    if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage:
getBalanceExample();
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching wallet balance...
API Response: {
  "statusDescription": "Success",
  "data": {
    "USDT": {
      "total": 10000.50,
      "free": 8500.25,
      "used": 1500.25
    },
    "BTC": {
      "total": 0.5,
      "free": 0.2,
      "used": 0.3
    }
    // ...
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Wallet Balance Data: {
  "USDT": { ... },
  "BTC": { ... }
  // ...
}
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and **initialized the client with valid authentication credentials** (JWT or API Key/Secret) first. See the [Python Client README](futures/clients/rest-http/python/README.md) and the [Authentication Guide](../../api-reference/authentication.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client` with proper authentication.

**Request:**

```python
import json

def get_balance_example():
    try:
        print("Fetching wallet balance...")
        # The client handles adding authentication headers automatically
        response = client.get_balance() #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Wallet Balance Data: {response.get('data')}")
            # Access specific asset balance:
            # data = response.get('data', {})
            # usdt_balance = data.get('USDT')
            # if usdt_balance:
            #     print(f"USDT Free Balance: {usdt_balance.get('free')}")
        else:
            # Handle potential auth errors (401) or other issues
            print(f"Failed to fetch wallet balance: {response.get('statusDescription')}")
            if response:
                print(f"Status Code: {response.get('statusCode')}")


    except Exception as e:
        print(f"Error fetching wallet balance: {e}")
        # Catch specific exceptions like ConnectionError if needed

# Example usage:
get_balance_example()
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching wallet balance...
API Response: {
  "statusDescription": "Success",
  "data": {
    "USDT": {
      "total": 10000.50,
      "free": 8500.25,
      "used": 1500.25
    },
    "BTC": {
      "total": 0.5,
      "free": 0.2,
      "used": 0.3
    }
    // ...
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Wallet Balance Data: {'USDT': {...}, 'BTC': {...}, ...}
```
