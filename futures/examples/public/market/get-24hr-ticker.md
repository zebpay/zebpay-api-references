# Example: Get 24hr Ticker

Retrieves price change statistics for a specific trading symbol over the last 24 hours.

**Endpoint:** `GET /api/v1/market/ticker24Hr`
**Authentication:** None Required
**Parameters:**
* `symbol` (string, query, required): The trading symbol (e.g., "BTCUSDT") .

---

### 1. cURL Example

**Request:**

```bash
# Replace BTCUSDT with the desired symbol
curl -X GET https://futuresbe.zebpay.com/api/v1/market/ticker24Hr?symbol=BTCUSDT \
  -H "Accept: application/json"
```

**Success Response (Example):**

```json
{
  "statusDescription": "Success",
  "data": {
    "symbol": "BTCUSDT",
    "info": {
      "eventTimestamp": 1712345678905,
      "symbol": "BTCUSDT",
      "priceChange": "150.50",
      "priceChangePercentage": "0.23",
      "weightedAveragePrice": "65100.00",
      "lastPrice": "65150.50",
      "lastQuantityTraded": "0.01",
      "openPrice": "65000.00",
      "highestPrice": "65500.00",
      "lowestPrice": "64800.00",
      "totalTradedVolume": "1500.50",
      "totalTradedQuoteAssetVolume": "97682775.00",
      "startTime": 1712259278905,
      "endTime": 1712345678905,
      "firstTradeId": 987000,
      "lastTradeId": 989500,
      "numberOfTrades": 2501
    },
    "timestamp": 1712345678905,
    "datetime": "2025-04-05T11:59:38.905Z",
    "high": 65500.00,
    "low": 64800.00,
    "vwap": 65100.00,
    "open": 65000.00,
    "close": 65150.50,
    "last": 65150.50,
    "change": 150.50,
    "percentage": 0.23,
    "average": 65075.25,
    "baseVolume": 1500.50,
    "quoteVolume": 97682775.00
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: Values will reflect live market data.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](futures/clients/rest-http/node/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function getTicker24hrExample(symbol) {
  try {
    console.log(`Workspaceing 24hr ticker for ${symbol}...`);
    // Ensure symbol is passed to the method
    const response = await client.getTicker24Hr(symbol); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log(`Ticker Data for ${symbol}:`, response.data);
      // Access specific fields:
      // const lastPrice = response.data.last;
      // const priceChangePercent = response.data.percentage;
      // console.log(`Last Price: ${lastPrice}, Change: ${priceChangePercent}%`);
    } else {
      console.error(`Failed to fetch ticker for ${symbol}:`, response.statusDescription);
    }
  } catch (error) {
    console.error(`Error fetching ticker for ${symbol}:`, error.message);
  }
}

// Example usage:
getTicker24hrExample('BTCUSDT');
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching 24hr ticker for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": {
    "symbol": "BTCUSDT",
    "info": {
      // ... raw info object ...
      "lastPrice": "65150.50",
      "priceChangePercentage": "0.23"
      // ...
    },
    "timestamp": 1712345678905,
    // ... other ticker fields ...
    "last": 65150.50,
    "percentage": 0.23
    // ...
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Ticker Data for BTCUSDT: {
  "symbol": "BTCUSDT",
  "info": { ... },
  "timestamp": 1712345678905,
  // ... other fields ...
}
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](futures/clients/rest-http/python/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def get_ticker_24hr_example(symbol):
    try:
        print(f"Fetching 24hr ticker for {symbol}...")
        # Ensure symbol is passed to the method
        response = client.get_ticker_24hr(symbol=symbol) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Ticker Data for {symbol}: {response.get('data')}")
            # Access specific fields:
            # data = response.get('data', {})
            # last_price = data.get('last')
            # price_change_percent = data.get('percentage')
            # print(f"Last Price: {last_price}, Change: {price_change_percent}%")
        else:
            print(f"Failed to fetch ticker for {symbol}: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching ticker for {symbol}: {e}")

# Example usage:
get_ticker_24hr_example('BTCUSDT')
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching 24hr ticker for BTCUSDT...
API Response: {
  "statusDescription": "Success",
  "data": {
    "symbol": "BTCUSDT",
    "info": {
      // ... raw info object ...
      "lastPrice": "65150.50",
      "priceChangePercentage": "0.23"
      // ...
    },
    "timestamp": 1712345678905,
    // ... other ticker fields ...
    "last": 65150.5,
    "percentage": 0.23
    // ...
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
Ticker Data for BTCUSDT: {'symbol': 'BTCUSDT', 'info': {...}, 'timestamp': 1712345678905, ...}
```
