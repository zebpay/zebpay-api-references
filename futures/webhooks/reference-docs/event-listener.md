# API Reference: Webhook Event Listener

Third-party services (e.g. TradingView or custom bots) invoke this endpoint to trigger trading actions. The listener uses **body-level authentication** – no HTTP headers are required.

> 🔒 **Auth fields:** `secret` + `timestamp` in the JSON body
> ⌚ **Timestamp tolerance:** configured server-side (`webhookTimestampTolearanceMS`), typically ±5 minutes

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
| `timestamp` | ISO-8601 UTC | Must fall within the configured timestamp window |

HTTP **`201 Created`** with `data = null` means the callback was **accepted**. Trade execution failures are logged and emailed and may still return `201`; do not treat `201` as confirmation that an order filled or a position closed.

---

### <a id="new-order"></a> NEW_ORDER Payload

| Field | Type | Rules |
|-------|------|-------|
| `symbol` | string | Trading pair, upper-cased |
| `amount` | number | Numeric quantity. The listener does not currently enforce `> 0`. |
| `side` | `BUY` \| `SELL` | – |
| `type` | `MARKET` `LIMIT` `STOP_MARKET` `STOP_LIMIT` | Do not send `STOP`. |
| `price` | number, optional | Required when `type = LIMIT` or `STOP_LIMIT` |
| `stopLossPrice` | number, optional | – |
| `takeProfitPrice` | number, optional | – |
| `marginAsset` | `INR` \| `USDT` | – |
| `clientOrderId` | string, optional | Free text ID |
| `leverage` | number, optional | When set, the order is placed with this leverage |
| `positionId` | string, optional | Accepted on NEW_ORDER; unused by cancel/close |

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

Cancels **all open orders** for the given symbol. This is not a single-order cancel by `clientOrderId`.

| Field | Type | Rules |
|-------|------|-------|
| `symbol` | string | Required. Trading pair whose open orders should be cancelled. |

Example

```json
{
  "action": "CANCEL_ORDER",
  "payload": { "symbol": "BTCUSDT" },
  "secret": "<64-char-secret>",
  "timestamp": "2025-08-05T12:35:21Z"
}
```

---

### <a id="close-position"></a> CLOSE_POSITION Payload

Closes the first **OPEN** position whose contract pair matches `symbol`. This is not a close-by-`positionId` API.

| Field | Type | Rules |
|-------|------|-------|
| `symbol` | string | Required. Trading pair of the open position to close. |

Example

```json
{
  "action": "CLOSE_POSITION",
  "payload": { "symbol": "BTCUSDT" },
  "secret": "<64-char-secret>",
  "timestamp": "2025-08-05T12:36:03Z"
}
```

---

## Error Responses

Errors follow the standard API envelope:

```json
{
  "statusDescription": "Webhook is paused. Please resume and try again",
  "data": {},
  "statusCode": 403,
  "customMessage": [
    "Webhook is paused. Please resume and try again"
  ]
}
```

| HTTP | Message |
|------|---------|
| 401 | `Invalid payload` |
| 403 | `Timestamp invalid` |
| 403 | `Forbidden request` (bad secret / unknown UUID) |
| 403 | `Action not supported by webhook` |
| 403 | `Webhook is paused. Please resume and try again` |
| 403 | `Account is blocked. Please contact customer support` |
| 403 | `User Account Inactive. Please contact customer support` |
| 403 | `Trading disabled for account. Please contact customer support` |
| 400 | `Invalid payload for NEW_ORDER` (or other action) |
| 400 | `symbol required for cancel order` |
| 400 | `symbol required for close position` |
