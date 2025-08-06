# Example: Pause Webhook

Temporarily disables a webhook; all incoming callbacks will be ignored while paused.

> **💡 Tip:** See the [API Reference for Pause Webhook](../../reference-docs/management.md#pause-webhook).

**Endpoint:** `PATCH /webhooks/:uuid/pause`
**Authentication:** Required (Bearer JWT)

-----

### 1. cURL Example

```bash
curl -X PATCH https://futuresbe.zebpay.com/webhooks/<uuid>/pause \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```

##### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": null,
  "statusCode": 200,
  "customMessage": ["OK"]
}
```

-----

### 2. Node.js (axios) Example

```javascript
const axios = require('axios');

async function pauseWebhook(uuid) {
  const { data } = await axios.patch(`https://futuresbe.zebpay.com/webhooks/${uuid}/pause`, null, {
    headers: {
      Authorization: 'Bearer <your_jwt_token>',
      Accept: 'application/json',
    },
  });
  console.log(data);
}
```

### 3. Python (requests) Example

```python
import requests, json

def pause_webhook(uuid):
    headers = {
        'Authorization': 'Bearer <your_jwt_token>',
        'Accept': 'application/json'
    }
    resp = requests.patch(f'https://futuresbe.zebpay.com/webhooks/{uuid}/pause', headers=headers, timeout=10)
    print(json.dumps(resp.json(), indent=2))
```
