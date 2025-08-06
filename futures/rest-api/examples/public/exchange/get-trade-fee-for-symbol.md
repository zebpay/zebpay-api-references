# Example: Get Trade Fee (Single Symbol)

Retrieves trading fee details (maker/taker) for a specific trading symbol.

**Endpoint:** `GET /api/v1/exchange/tradefee`
**Authentication:** None Required
**Parameters:**
* `symbol` (string, query, required): The trading symbol (e.g., "BTCUSDT") .

---

### 1. cURL Example

**Request:**

```bash
# Replace BTCUSDT with the desired symbol
curl -X GET https://futuresbe.zebpay.com/api/v1/exchange/tradefee?symbol=BTCUSDT \
  -H "Accept: application/json"
```

**Success Response (Example):**

```json
{
  "statusDescription": "Success",
  "data": {
    "symbol": "BTCUSDT",
    "makerFee": 0.001,
    "takerFee": 0.002
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: Fee values are examples and may differ.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](../../../clients/http/node/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function getTradeFeeExample(symbol) {
  try {
    console.log(`Workspaceing trade fee for ${symbol}...`);
    // Ensure symbol is passed to the method
    const response = await client.getTradeFee(symbol); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log(`Trade Fee Data for ${symbol}:`, response.data);
      // Access fees:
      // const makerFee = response.data.makerFee;
      // const takerFee = response.data.takerFee;
      // console.log(`Maker: ${makerFee}, Taker: ${takerFee}`);
    } else {
      console.error(`Failed to fetch trade fee for ${symbol}:`, response.statusDescription);
    }
  } catch (error) {
    console.error(`Error fetching trade fee for ${symbol}:`, error.message);
  }
}

// Example usage:
getTradeFeeExample('BTCUSDT');
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching trade fee for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": {
    "symbol": "BTCUSDT",
    "makerFee": 0.001,
    "takerFee": 0.002
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Trade Fee Data for BTCUSDT: {
  "symbol": "BTCUSDT",
  "makerFee": 0.001,
  "takerFee": 0.002
}
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](../../../clients/http/python/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def get_trade_fee_example(symbol):
    try:
        print(f"Fetching trade fee for {symbol}...")
        # Ensure symbol is passed to the method
        response = client.get_trade_fee(symbol=symbol) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Trade Fee Data for {symbol}: {response.get('data')}")
            # Access fees:
            # data = response.get('data', {})
            # maker_fee = data.get('makerFee')
            # taker_fee = data.get('takerFee')
            # print(f"Maker: {maker_fee}, Taker: {taker_fee}")
        else:
            print(f"Failed to fetch trade fee for {symbol}: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching trade fee for {symbol}: {e}")

# Example usage:
get_trade_fee_example('BTCUSDT')
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching trade fee for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": {
    "symbol": "BTCUSDT",
    "makerFee": 0.001,
    "takerFee": 0.002
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Trade Fee Data for BTCUSDT: {'symbol': 'BTCUSDT', 'makerFee': 0.001, 'takerFee': 0.002}
```
