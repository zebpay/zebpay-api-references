# Example: List Webhooks

Retrieves all webhooks that belong to the authenticated account.

> **💡 Tip:** See the [API Reference for List Webhooks](../../reference-docs/management.md#list-webhooks).

**Endpoint:** `GET /webhooks`
**Authentication:** Required (Bearer JWT)

-----

### 1. cURL Example

```bash
curl -X GET https://futuresbe.zebpay.com/webhooks \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": [
    {
      "accountId": "12345",
      "webhookId": "5a51b5ca-2998-4c16-8351-8b4d2584127f",
      "webhookName": "TradingView Signals",
      "allowedActions": ["NEW_ORDER", "CANCEL_ORDER"],
      "isPaused": false,
      "createdAt": "2025-08-05T06:00:41.000Z",
      "updatedAt": "2025-08-05T06:00:41.000Z",
      "stats": {
        "NEW_ORDER": { "totalCount": 12, "successCount": 11 },
        "CANCEL_ORDER": { "totalCount": 2, "successCount": 2 },
        "CLOSE_POSITION": { "totalCount": 0, "successCount": 0 }
      }
    }
  ],
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

-----

### 2. Node.js (axios) Example

```javascript
const axios = require('axios');

async function listWebhooks() {
  const res = await axios.get('https://futuresbe.zebpay.com/webhooks', {
    headers: {
      Authorization: 'Bearer <your_jwt_token>',
      Accept: 'application/json',
    },
  });
  console.log(res.data);
}
```

### 3. Python (requests) Example

```python
import requests, json

resp = requests.get(
    'https://futuresbe.zebpay.com/webhooks',
    headers={'Authorization': 'Bearer <your_jwt_token>', 'Accept': 'application/json'},
    timeout=10,
)
print(json.dumps(resp.json(), indent=2))
```
