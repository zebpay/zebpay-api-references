# Example: Resume Webhook

Re-enables a previously paused webhook.

> **💡 Tip:** See the [API Reference for Resume Webhook](../../reference-docs/management.md#resume-webhook).

**Endpoint:** `PATCH /webhooks/:uuid/resume`
**Authentication:** Required (Bearer JWT)

-----

### 1. cURL Example

```bash
curl -X PATCH https://futuresbe.zebpay.com/webhooks/<uuid>/resume \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```

##### Success Response (Example)

Same as *Pause Webhook* (`200` with `data=null`).

-----

### 2. Node.js (axios) Example

```javascript
const axios = require('axios');

async function resumeWebhook(uuid) {
  const { data } = await axios.patch(`https://futuresbe.zebpay.com/webhooks/${uuid}/resume`, null, {
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

def resume_webhook(uuid):
    headers = {
        'Authorization': 'Bearer <your_jwt_token>',
        'Accept': 'application/json'
    }
    resp = requests.patch(f'https://futuresbe.zebpay.com/webhooks/{uuid}/resume', headers=headers, timeout=10)
    print(json.dumps(resp.json(), indent=2))
```
