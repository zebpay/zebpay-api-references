# Example: Get Positions

Retrieves a list of the user's current and/or historical positions, optionally filtered by symbols or status.

> **💡 Tip:** For full details on endpoint parameters, see the [API Reference for Get Positions](../../api-reference/private-endpoints/trade.md#get-positions).

**Endpoint:** `GET /api/v1/trade/positions`
**Authentication:** Required (JWT or API Key/Secret)
**Query Parameters:**

* `symbols` (`Array<string>`, optional): List of trading symbols to filter by (e.g., `symbols=BTCUSDT&symbols=ETHUSDT`) . If omitted, positions for all symbols are returned.
* `status` (`string`, optional): Filter by status (`"OPEN"`, `"CLOSED"`, `"LIQUIDATED"`) . If omitted, positions with any status might be returned (check API behavior).

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../api-reference/authentication.md) for details on generating headers.

#### Using JWT Authentication (Get Open Positions for Specific Symbols)

```bash
# URL encodes as: symbols=BTCUSDT&symbols=ETHUSDT
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/positions?symbols=BTCUSDT&symbols=ETHUSDT&status=OPEN \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
````

#### Using API Key + Secret Authentication (Get All Positions)

```bash
# Remember to include the timestamp in the query string for signing
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/positions \
  -H "Accept: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>"
```

#### Success Response (Example - Single Open Position)

```json
{
  "statusDescription": "Success",
  "data": [
    {
      "id": "pos-btc-long-123",
      "symbol": "BTCUSDT",
      "timestamp": 1712347500000,
      "datetime": "2025-04-05T13:25:00.000Z",
      "side": "long",
      "contracts": 0.05,
      "contractSize": 1,
      "entryPrice": 65100.00,
      "notional": 3255.00,
      "leverage": 10,
      "initialMargin": 325.50,
      "liquidationPrice": 59000.00,
      "marginMode": "isolated",
      "status": "OPEN"
    }
    // ... potentially more positions
  ],
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: The response is an array of [Position objects](../../api-reference/data-models.md#position).*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../clients/rest-http/node/README.md) .

```javascript
async function getPositionsExample(symbols = [], status = undefined) {
  try {
    let logMsg = "Fetching positions";
    if (symbols.length > 0) logMsg += ` for symbols: ${symbols.join(', ')}`;
    if (status) logMsg += ` with status: ${status}`;
    console.log(logMsg + "...");

    // Client handles authentication headers automatically
    const response = await client.getPositions(symbols, status); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Get Positions Response Data:", response.data);
      // Access the list of positions:
      // const positions = response.data;
      // console.log(`Found ${positions.length} positions.`);
    } else {
      console.error("Failed to fetch positions:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching positions:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage: Get OPEN positions for BTCUSDT and ETHUSDT
getPositionsExample(['BTCUSDT', 'ETHUSDT'], 'OPEN');

// Example usage: Get all positions (any status)
// getPositionsExample();
```

**Output (Example for Filtered Request):**

```js
// Full API response first...
Fetching positions for symbols: BTCUSDT, ETHUSDT with status: OPEN...
API Response: {
  "statusDescription": "Success",
  "data": [ // ... (data array as shown in cURL example) ... ],
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Get Positions Response Data: [ // ... (data array as shown in cURL example) ... ]
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../clients/rest-http/python/README.md) .

```python
import json

def get_positions_example(symbols=None, status=None):
    try:
        log_msg = "Fetching positions"
        if symbols:
            log_msg += f" for symbols: {', '.join(symbols)}"
        if status:
            log_msg += f" with status: {status}"
        print(log_msg + "...")

        # Client handles authentication headers automatically
        response = client.get_positions(symbols=symbols, status=status) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Get Positions Response Data: {response.get('data')}")
            # Access the list of positions:
            # positions = response.get('data', [])
            # print(f"Found {len(positions)} positions.")
        else:
            print(f"Failed to fetch positions: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error fetching positions: {e}")

# Example usage: Get OPEN positions for BTCUSDT and ETHUSDT
get_positions_example(symbols=['BTCUSDT', 'ETHUSDT'], status='OPEN')

# Example usage: Get all positions (any status)
# get_positions_example()
```

**Output (Example for Filtered Request):**

```js
// Full API response first...
Fetching positions for symbols: BTCUSDT, ETHUSDT with status: OPEN...
API Response: {
  "statusDescription": "Success",
  "data": [ // ... (data array as shown in cURL example, Python format) ... ],
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Get Positions Response Data: [ // ... (data array as shown in cURL example, Python format) ... ]
```
