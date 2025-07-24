# Example: Get Transaction History

Retrieves the user's historical transactions (e.g., commissions, funding fees) with pagination support.

> **💡 Tip:** For full details on endpoint parameters and response fields, see the [API Reference for Get Transaction History](../../../../api-reference/private-endpoints/trade.md#get-txn-history).

**Endpoint:** `GET /api/v1/trade/transaction/history`
**Authentication:** Required (JWT or API Key/Secret)
**Query Parameters:**

* `pageSize` (`number`, optional): Number of transactions to return per page .
* `timestamp` (`number`, optional): Fetch transactions created before this Unix timestamp (ms). Used for pagination; use the `nextTimestamp` value from a previous response to get the next page .

-----

### 1. cURL Example

> **💡 Tip:** See the [Authentication Guide](../../../../api-reference/authentication.md) for details on generating headers.

#### Using JWT Authentication

```bash
# Get the first page, e.g., 20 transactions per page
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/transaction/history?pageSize=20 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Using API Key + Secret Authentication

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/trade/transaction/history?pageSize=20 \
  -H "Accept: application/json" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: <generated_hmac_sha256_signature>"
```

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": {
    "items": [
      {
        "txid": "txn-fee-abc",
        "timestamp": 1712154000000,
        "datetime": "2025-04-03T12:00:00.000Z",
        "type": "COMMISSION",
        "amount": -0.6505,
        "currency": "USDT",
        "status": "completed",
        "fee": {},
        "info": {
          /* raw exchange data */
        }
      },
      {
        "txid": "txn-funding-def",
        "timestamp": 1712067600000,
        "datetime": "2025-04-02T12:00:00.000Z",
        "type": "FUNDING_FEE",
        "amount": -1.2345,
        "currency": "USDT",
        "status": "completed",
        "fee": {},
        "info": {
          /* raw exchange data */
        }
      }
      // ... more transactions up to pageSize
    ],
    "totalCount": 35,
    "nextTimestamp": 1712067599999 // Use this timestamp to query the next page
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

*Note: See [TransactionsListResponse model](../../../../api-reference/data-models.md#transactionslistresponse) and [Transaction model](../../../../api-reference/data-models.md#transaction) for field details.*

-----

### 2\. Node.js Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Node.js Client README](../../../../clients/rest-http/node/README.md) .

```javascript
async function getTransactionHistoryExample(options = {}) {
  try {
    console.log(`Workspaceing transaction history...`);
    // Client handles authentication headers automatically
    const response = await client.getTransactionHistory(options); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("Transaction History Response Data:", response.data);
      // Access the list of transactions and pagination token:
      // const transactions = response.data.items;
      // const nextTimestamp = response.data.nextTimestamp;
      // console.log(`Workspaceed ${transactions.length} transactions. Next page timestamp: ${nextTimestamp}`);
      // if (nextTimestamp) {
      //   // Fetch next page: await getTransactionHistoryExample({ pageSize: options.pageSize, timestamp: nextTimestamp });
      // }
    } else {
      console.error("Failed to fetch transaction history:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching transaction history:", error.message);
     if (error.cause && error.cause.response) {
        console.error("API Error Details:", error.cause.response.data);
    }
  }
}

// Example usage: Get first page with 20 items
getTransactionHistoryExample({ pageSize: 20 });

// To fetch the next page, you would use the 'nextTimestamp' from the first response:
// getTransactionHistoryExample({ pageSize: 20, timestamp: 1712067599999 }); // Example timestamp
```

**Output (Example):**

```js
// Full API response first...
Fetching transaction history...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (items as shown in cURL example) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Transaction History Response Data: { // ... (data as shown in cURL example) ... }
```

-----

### 3\. Python Client Example

> **💡 Tip:** Ensure the client is initialized with authentication. See [Python Client README](../../../../clients/rest-http/python/README.md) .

```python
import json

def get_transaction_history_example(page_size=None, timestamp=None):
    try:
        print(f"Fetching transaction history...")
        # Client handles authentication headers automatically
        response = client.get_transaction_history(page_size=page_size, timestamp=timestamp) #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"Transaction History Response Data: {response.get('data')}")
            # Access the list of transactions and pagination token:
            # transactions_data = response.get('data', {})
            # transactions = transactions_data.get('items', [])
            # next_timestamp = transactions_data.get('nextTimestamp')
            # print(f"Fetched {len(transactions)} transactions. Next page timestamp: {next_timestamp}")
            # if next_timestamp:
            #   # Fetch next page: get_transaction_history_example(page_size=page_size, timestamp=next_timestamp)
        else:
            print(f"Failed to fetch transaction history: {response.get('statusDescription')}")
            if response: print(f"Status Code: {response.get('statusCode')}")

    except Exception as e:
        print(f"Error fetching transaction history: {e}")

# Example usage: Get first page with 20 items
get_transaction_history_example(page_size=20)

# To fetch the next page, you would use the 'nextTimestamp' from the first response:
# get_transaction_history_example(page_size=20, timestamp=1712067599999) # Example timestamp
```

**Output (Example):**

```js
// Full API response first...
Fetching transaction history...
API Response: {
  "statusDescription": "Success",
  "data": { // ... (data as shown in cURL example, Python format) ... },
  "statusCode": 200, "customMessage": ["OK"] }
// Extracted data...
Transaction History Response Data: { // ... (data as shown in cURL example, Python format) ... }
```
