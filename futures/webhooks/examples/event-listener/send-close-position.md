# Example: Send CLOSE_POSITION Signal

Closes an existing position via the webhook listener.

> **💡 Tip:** See the [Webhook Callback section](../../reference-docs/event-listener.md#close-position) for the payload schema.

**Endpoint:** `POST /webhooks/:uuid`
**Authentication:** No HTTP headers – use `secret` + `timestamp` in body

-----

### 1. cURL Example

```bash
curl -X POST https://futuresbe.zebpay.com/webhooks/<uuid> \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
        "action": "CLOSE_POSITION",
        "payload": { "positionId": "pos-123" },
        "secret": "<secret>",
        "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      }'
```

-----

### 2. Node.js (axios) Example

```javascript
const axios = require('axios');

async function sendClosePositionSignal(callbackUrl, secret) {
  const body = {
    action: 'CLOSE_POSITION',
    payload: { positionId: 'pos-123' },
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

def send_close_position(callback_url, secret):
    body = {
        'action': 'CLOSE_POSITION',
        'payload': { 'positionId': 'pos-123' },
        'secret': secret,
        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
    }
    r = requests.post(callback_url, json=body, headers={'Content-Type': 'application/json', 'Accept': 'application/json'}, timeout=10)
    print(json.dumps(r.json(), indent=2))
```
