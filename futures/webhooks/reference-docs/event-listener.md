# API Reference: Webhook Event Listener

Third-party services (e.g. TradingView or custom bots) invoke this endpoint to trigger trading actions. The listener uses **body-level authentication** – no HTTP headers are required.

> 🔒 **Auth fields:** `secret` + `timestamp` in the JSON body
> ⌚ **Timestamp tolerance:** ±5 minutes (prevents replay attacks)

### Callback URL

The callback URL is returned when you [create a webhook](./management.md#create-webhook):

```
POST https://futuresbe.zebpay.com/webhooks/:uuid
```

`uuid` = the webhook identifier returned at creation time.

---

## <a id="webhook-callback"></a> Send Trading-Signal Event

#### Request

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `POST` |
| **Endpoint Path** | `/webhooks/:uuid` |
| **Auth Required** | No headers – validated via body |
| **Request Body** | (object, required) – envelope below |

### Common Envelope

| Field | Type | Notes |
|-------|------|-------|
| `action` | enum `NEW_ORDER` `CANCEL_ORDER` `CLOSE_POSITION` | Determines payload schema |
| `payload` | object | Schema depends on `action` |
| `secret` | 64-char **hex** | Must match secret issued at creation |
| `timestamp` | ISO-8601 UTC | ±5 min tolerance |

Successful response: **`201 Created`** with `data = null`.

---

### <a id="new-order"></a> NEW_ORDER Payload

| Field | Type | Rules |
|-------|------|-------|
| `symbol` | string | Trading pair, upper-cased |
| `amount` | number | > 0 |
| `side` | `BUY` \| `SELL` | – |
| `type` | `MARKET` `LIMIT` `STOP_MARKET` `STOP` | – |
| `price` | number, optional | Required when `type = LIMIT` |
| `stopLossPrice` | number, optional | – |
| `takeProfitPrice` | number, optional | – |
| `marginAsset` | `INR` \| `USDT` | – |
| `clientOrderId` | string, optional | Free text ID |

Example

```json
{
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
  "secret": "<64-char-secret>",
  "timestamp": "2025-08-05T12:34:56Z"
}
```

---

### <a id="cancel-order"></a> CANCEL_ORDER Payload

| Field | Type | Rules |
|-------|------|-------|
| `clientOrderId` | string | Required |

Example

```json
{
  "action": "CANCEL_ORDER",
  "payload": { "clientOrderId": "tv-1703" },
  "secret": "<64-char-secret>",
  "timestamp": "2025-08-05T12:35:21Z"
}
```

---

### <a id="close-position"></a> CLOSE_POSITION Payload

| Field | Type | Rules |
|-------|------|-------|
| `positionId` | string | Required |

Example

```json
{
  "action": "CLOSE_POSITION",
  "payload": { "positionId": "pos-123" },
  "secret": "<64-char-secret>",
  "timestamp": "2025-08-05T12:36:03Z"
}
```

---

## Error Responses

Errors follow structure:

```json
{
  "statusCode": 403,
  "message": "Webhook is paused. Please resume and try again",
  "error": "Forbidden"
}
```

| HTTP | Message |
|------|---------|
| 401 | `Invalid payload` |
| 403 | `Timestamp invalid` |
| 403 | `Forbidden request` (bad secret / unknown UUID) |
| 403 | `Action not supported by webhook` |
| 403 | `Webhook is paused. Please resume and try again` |
| 400 | `Invalid payload for NEW_ORDER` (or other action) |
