# Example: Get Trade Fees (All Symbols)

Retrieves trading fee details for all supported trading pairs.

**Endpoint:** `GET /api/v1/exchange/tradefees`
**Authentication:** None Required
**Parameters:** None .

---

### 1. cURL Example

**Request:**

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/exchange/tradefees \
  -H "Accept: application/json"
```

**Success Response (Example - Excerpt):**

```json
{
  "statusDescription": "Success",
  "data": [
    {
      "symbol": "BTCUSDT",
      "makerFee": 0.001,
      "takerFee": 0.002
    },
    {
      "symbol": "ETHUSDT",
      "makerFee": 0.0012,
      "takerFee": 0.0022
    }
    // ... more symbols
  ],
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: The response contains a list of all pairs and their fees.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](../../../clients/rest-http/node/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function getTradeFeesExample() {
  try {
    console.log("Fetching all trade fees...");
    const response = await client.getTradeFees(); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Trade Fees Data (list):", response.data);
      // Iterate or find specific symbol fees:
      // const btcFees = response.data.find(item => item.symbol === 'BTCUSDT');
      // if (btcFees) {
      //   console.log(`BTC Maker: ${btcFees.makerFee}, Taker: ${btcFees.takerFee}`);
      // }
    } else {
      console.error("Failed to fetch trade fees:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching trade fees:", error.message);
  }
}

// Example usage:
getTradeFeesExample();
```

**Output (Example - Excerpt):**

```json
// Console output showing the full API response first
Fetching all trade fees...
API Response: {
  "statusDescription": "Success",
  "data": [
    {
      "symbol": "BTCUSDT",
      "makerFee": 0.001,
      "takerFee": 0.002
    },
    {
      "symbol": "ETHUSDT",
      "makerFee": 0.0012,
      "takerFee": 0.0022
    }
    // ...
  ],
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Trade Fees Data (list): [
  {
    "symbol": "BTCUSDT",
    "makerFee": 0.001,
    "takerFee": 0.002
  },
  // ...
]
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](../../../clients/rest-http/python/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def get_trade_fees_example():
    try:
        print("Fetching all trade fees...")
        response = client.get_trade_fees() #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Trade Fees Data (list): {response.get('data')}")
            # Iterate or find specific symbol fees:
            # data = response.get('data', [])
            # btc_fees = next((item for item in data if item.get('symbol') == 'BTCUSDT'), None)
            # if btc_fees:
            #     print(f"BTC Maker: {btc_fees.get('makerFee')}, Taker: {btc_fees.get('takerFee')}")
        else:
            print(f"Failed to fetch trade fees: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching trade fees: {e}")

# Example usage:
get_trade_fees_example()
```

**Output (Example - Excerpt):**

```json
// Console output showing the full API response first
Fetching all trade fees...
API Response: {
  "statusDescription": "Success",
  "data": [
    {
      "symbol": "BTCUSDT",
      "makerFee": 0.001,
      "takerFee": 0.002
    },
    {
      "symbol": "ETHUSDT",
      "makerFee": 0.0012,
      "takerFee": 0.0022
    }
    // ...
  ],
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Trade Fees Data (list): [{'symbol': 'BTCUSDT', 'makerFee': 0.001, 'takerFee': 0.002}, ...]
```
