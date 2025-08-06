# Example: Send NEW_ORDER Signal

Sends a `NEW_ORDER` trading signal to the webhook callback URL.

> **💡 Tip:** See the [Webhook Callback section](../../reference-docs/event-listener.md#webhook-callback) for the full payload schema.

**Endpoint:** `POST /webhooks/:uuid`
**Authentication:** No HTTP headers – use `secret` + `timestamp` in body

-----

### 1. cURL Example

Replace `<uuid>` with your webhook ID and `<secret>` with the 64-char secret you saved during creation.

```bash
curl -X POST https://futuresbe.zebpay.com/webhooks/<uuid> \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
        "action": "NEW_ORDER",
        "payload": {
          "symbol": "BTCUSDT",
          "amount": 0.01,
          "side": "BUY",
          "type": "LIMIT",
          "price": 29350.5,
          "marginAsset": "USDT",
          "clientOrderId": "tv-1703"
        },
        "secret": "<secret>",
        "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      }'
```

*If your shell does not support `date -u +%Y-%m-%dT%H:%M:%SZ`, replace the timestamp with an ISO-8601 UTC string generated in your application.*

#### Success Response (Example)

```json
{
  "statusDescription": "Success",
  "data": null,
  "statusCode": 201,
  "customMessage": ["Created"]
}
```

-----

### 2. Node.js (axios) Example

```javascript
const axios = require('axios');

async function sendNewOrderSignal(callbackUrl, secret) {
  const body = {
    action: 'NEW_ORDER',
    payload: {
      symbol: 'BTCUSDT',
      amount: 0.01,
      side: 'BUY',
      type: 'LIMIT',
      price: 29350.5,
      marginAsset: 'USDT',
      clientOrderId: 'tv-1703',
    },
    secret,
    timestamp: new Date().toISOString(),
  };

  const res = await axios.post(callbackUrl, body, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
  console.log(res.data);
}
```

### 3. Python (requests) Example

```python
import requests, json, datetime

def send_new_order_signal(callback_url, secret):
    body = {
        'action': 'NEW_ORDER',
        'payload': {
            'symbol': 'BTCUSDT',
            'amount': 0.01,
            'side': 'BUY',
            'type': 'LIMIT',
            'price': 29350.5,
            'marginAsset': 'USDT',
            'clientOrderId': 'tv-1703',
        },
        'secret': secret,
        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
    }
    response = requests.post(callback_url, json=body, headers={'Content-Type': 'application/json', 'Accept': 'application/json'}, timeout=10)
    print(json.dumps(response.json(), indent=2))
```
