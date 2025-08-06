# Example: Get System Time

Retrieves the current API server time. Useful for synchronizing clocks.

**Endpoint:** `GET /api/v1/system/time`
**Authentication:** None Required

---

### 1. cURL Example

**Request:**

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/system/time \
  -H "Accept: application/json"
```

**Success Response (Example):**

```json
{
  "statusDescription": "Success",
  "data": {
    "timestamp": 1712345678000
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: The `timestamp` value will reflect the actual current server time.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](../../../clients/http/node/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function getSystemTimeExample() {
  try {
    console.log("Fetching system time...");
    const response = await client.getSystemTime(); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("System Time Data:", response.data);
      // Access the timestamp:
      // const serverTime = response.data.timestamp;
      // console.log("Server Timestamp:", serverTime);
    } else {
      console.error("Failed to fetch system time:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching system time:", error.message);
  }
}

getSystemTimeExample();
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching system time...
API Response: {
  "statusDescription": "Success",
  "data": {
    "timestamp": 1712345678000
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
System Time Data: {
  "timestamp": 1712345678000
}
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](../../../clients/http/python/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def get_system_time_example():
    try:
        print("Fetching system time...")
        response = client.get_system_time() #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"System Time Data: {response.get('data')}")
            # Access the timestamp:
            # server_time = response.get('data', {}).get('timestamp')
            # print(f"Server Timestamp: {server_time}")
        else:
            print(f"Failed to fetch system time: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching system time: {e}")

get_system_time_example()
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching system time...
API Response: {
  "statusDescription": "Success",
  "data": {
    "timestamp": 1712345678000
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
System Time Data: {'timestamp': 1712345678000}
```
