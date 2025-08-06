# Example: Create Webhook

Creates a new webhook and returns a unique callback URL plus a one-time secret.

> **💡 Tip:** For parameter details, see the [API Reference for Create Webhook](../../reference-docs/management.md#create-webhook).

**Endpoint:** `POST /webhooks`
**Authentication:** Required (Bearer JWT)

-----

### 1. cURL Example

#### Using JWT Authentication

```bash
curl -X POST https://futuresbe.zebpay.com/webhooks \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
        "webhookName": "TradingView Signals",
        "allowedActions": ["NEW_ORDER", "CANCEL_ORDER"]
      }'
```

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": {
    "webhookUrl": "https://futuresbe.zebpay.com/webhook/5a51b5ca-2998-4c16-8351-8b4d2584127f",
    "secret": "ab12cd34ef567890ab12cd34ef567890ab12cd34ef567890ab12cd34ef567890",
    "message": "Secret is shared one time only. Please save and send in future requests."
  },
  "statusCode": 201,
  "customMessage": ["Created"]
}
```

-----

### 2. Node.js (axios) Example

> **💡 Tip:** The client handles JWT headers automatically once configured.

```javascript
const axios = require('axios');

async function createWebhook() {
  const body = {
    webhookName: 'TradingView Signals',
    allowedActions: ['NEW_ORDER', 'CANCEL_ORDER'],
  };

  const res = await axios.post('https://futuresbe.zebpay.com/webhooks', body, {
    headers: {
      Authorization: 'Bearer <your_jwt_token>',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  console.log(res.data);
}
```

### 3. Python (requests) Example

```python
import requests, json

url = 'https://futuresbe.zebpay.com/webhooks'
headers = {
    'Authorization': 'Bearer <your_jwt_token>',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
payload = {
    'webhookName': 'TradingView Signals',
    'allowedActions': ['NEW_ORDER', 'CANCEL_ORDER']
}

response = requests.post(url, headers=headers, json=payload, timeout=10)
print(json.dumps(response.json(), indent=2))
```
