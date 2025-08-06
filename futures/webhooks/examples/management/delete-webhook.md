# Example: Delete Webhook

Removes a webhook permanently; deleted webhooks stop receiving callbacks.

> **💡 Tip:** See the [API Reference for Delete Webhook](../../reference-docs/management.md#delete-webhook).

**Endpoint:** `DELETE /webhooks/:uuid`
**Authentication:** Required (Bearer JWT)

-----

### 1. cURL Example

```bash
curl -X DELETE https://futuresbe.zebpay.com/webhooks/<uuid> \
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

async function deleteWebhook(uuid) {
  const { data } = await axios.delete(`https://futuresbe.zebpay.com/webhooks/${uuid}`, {
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

def delete_webhook(uuid):
    headers = {
        'Authorization': 'Bearer <your_jwt_token>',
        'Accept': 'application/json'
    }
    resp = requests.delete(f'https://futuresbe.zebpay.com/webhooks/{uuid}', headers=headers, timeout=10)
    print(json.dumps(resp.json(), indent=2))
```
