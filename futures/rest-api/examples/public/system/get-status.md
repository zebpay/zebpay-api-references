# Example: Get System Status

Checks the operational status of the API system.

**Endpoint:** `GET /api/v1/system/status`
**Authentication:** None Required

---

### 1. cURL Example

**Request:**

```bash
curl -X GET https://futuresbe.zebpay.com/api/v1/system/status \
  -H "Accept: application/json"
```

**Success Response (Example):**

```json
{
  "statusDescription": "Success",
  "data": {
    "status": "ok"
  },
  "statusCode": 200,
  "customMessage": ["OK"]
}
```
*Note: The `status` value might change based on the actual system health.*

---

### 2. Node.js Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Node.js Client README](../../../clients/http/node/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```javascript
async function getSystemStatusExample() {
  try {
    console.log("Fetching system status...");
    const response = await client.getSystemStatus(); //
    console.log("API Response:", JSON.stringify(response, null, 2));

    if (response && [200, 201].includes(response.statusCode)) {
      console.log("System Status Data:", response.data);
      // Access the status:
      // const systemOk = response.data.status === 'ok';
      // console.log("Is system OK?", systemOk);
    } else {
      console.error("Failed to fetch system status:", response.statusDescription);
    }
  } catch (error) {
    console.error("Error fetching system status:", error.message);
  }
}

getSystemStatusExample();
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching system status...
API Response: {
  "statusDescription": "Success",
  "data": {
    "status": "ok"
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
System Status Data: {
  "status": "ok"
}
```

---

### 3. Python Client Example

> **💡 Tip:** Ensure you have installed and initialized the client first. See the [Python Client README](../../../clients/http/python/README.md) for setup instructions .

Assumes you have initialized the `FuturesApiClient` as `client`.

**Request:**

```python
import json

def get_system_status_example():
    try:
        print("Fetching system status...")
        response = client.get_system_status() #
        print(f"API Response: {json.dumps(response, indent=2)}")

        if response and response.get("statusCode") in [200, 201]:
            print(f"System Status Data: {response.get('data')}")
            # Access the status:
            # system_ok = response.get('data', {}).get('status') == 'ok'
            # print(f"Is system OK? {system_ok}")
        else:
            print(f"Failed to fetch system status: {response.get('statusDescription')}")

    except Exception as e:
        print(f"Error fetching system status: {e}")

get_system_status_example()
```

**Output (Example):**

```json
// Console output showing the full API response first
Fetching system status...
API Response: {
  "statusDescription": "Success",
  "data": {
    "status": "ok"
  },
  "statusCode": 200,
  "customMessage": [
    "OK"
  ]
}
// Followed by the extracted data
System Status Data: {'status': 'ok'}
```
