# Example: Send CANCEL_ORDER Signal

Cancels an existing client order via the webhook listener.

> **💡 Tip:** See the [Webhook Callback section](../../reference-docs/event-listener.md#cancel-order) for the payload schema.

**Endpoint:** `POST /webhooks/:uuid`
**Authentication:** No HTTP headers – use `secret` + `timestamp` in body

-----

### 1. cURL Example

```bash
curl -X POST https://futuresbe.zebpay.com/webhooks/<uuid> \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
        "action": "CANCEL_ORDER",
        "payload": { "clientOrderId": "tv-1703" },
        "secret": "<secret>",
        "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      }'
```

-----

### 2. Node.js (axios) Example

```javascript
const axios = require('axios');

async function sendCancelOrderSignal(callbackUrl, secret) {
  const body = {
    action: 'CANCEL_ORDER',
    payload: { clientOrderId: 'tv-1703' },
    secret,
    timestamp: new Date().toISOString(),
  };
  const { data } = await axios.post(callbackUrl, body, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
  console.log(data);
}
```

### 3. Python (requests) Example

```python
import requests, json, datetime

def send_cancel_order(callback_url, secret):
    body = {
        'action': 'CANCEL_ORDER',
        'payload': { 'clientOrderId': 'tv-1703' },
        'secret': secret,
        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
    }
    r = requests.post(callback_url, json=body, headers={'Content-Type': 'application/json', 'Accept': 'application/json'}, timeout=10)
    print(json.dumps(r.json(), indent=2))
```
