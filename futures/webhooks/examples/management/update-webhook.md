# Example: Update Webhook

Updates the webhook name and merges additional allowed actions. Both `webhookName` and `allowedActions` are required; supplied actions are unioned with the existing list.

> **💡 Tip:** See the [API Reference for Update Webhook](../../reference-docs/management.md#update-webhook).

**Endpoint:** `PATCH /webhooks/:uuid`
**Authentication:** Required (Bearer JWT)

-----

### 1. cURL Example

```bash
curl -X PATCH https://futuresbe.zebpay.com/webhooks/<uuid> \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "webhookName": "TradingView + Telegram",
        "allowedActions": ["CLOSE_POSITION"]
      }'
```

#### Success Response (Example)

```json
{
  "statusDescription": "Updated Webhook Successfully",
  "data": {
    "webhookId": "<uuid>",
    "accountId": "12345",
    "webhookName": "TradingView + Telegram",
    "allowedActions": ["NEW_ORDER", "CANCEL_ORDER", "CLOSE_POSITION"],
    "createdAt": "2025-08-05T06:00:41.000Z",
    "updatedAt": "2025-08-05T06:30:12.000Z"
  },
  "statusCode": 201,
  "customMessage": ["Updated Webhook Successfully"]
}
```

-----

### 2. Node.js (axios) Example

```javascript
const axios = require('axios');

async function updateWebhook(uuid) {
  const body = {
    webhookName: 'TradingView + Telegram',
    allowedActions: ['CLOSE_POSITION'],
  };

  const { data } = await axios.patch(`https://futuresbe.zebpay.com/webhooks/${uuid}`, body, {
    headers: {
      Authorization: 'Bearer <your_jwt_token>',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  console.log(data);
}
```

### 3. Python (requests) Example

```python
import requests, json

def update_webhook(uuid):
    payload = {
        'webhookName': 'TradingView + Telegram',
        'allowedActions': ['CLOSE_POSITION']
    }
    headers = {
        'Authorization': 'Bearer <your_jwt_token>',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    resp = requests.patch(f'https://futuresbe.zebpay.com/webhooks/{uuid}', json=payload, headers=headers, timeout=10)
    print(json.dumps(resp.json(), indent=2))
```
