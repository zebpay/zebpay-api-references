# API Reference: Webhook Management

These **private** endpoints let you create, view and maintain webhooks that later receive trading-signal callbacks.

> 🔑 **Authentication:** Bearer JWT
> 🖥️ **UI note:** The Futures UI will surface these operations soon; until then you can call them programmatically.

### Base Path

`https://futuresbe.zebpay.com`

---

### <a id="create-webhook"></a> Create Webhook

Creates a new webhook and returns a one-time secret and a dedicated callback URL.

#### Request

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `POST` |
| **Endpoint Path** | `/webhooks` |
| **Auth Required** | Yes (Bearer JWT) |
| **Request Body** | (object, required) |

Body parameters:

| Field | Type | Rules |
|-------|------|-------|
| `webhookName` | string | Required. Length 1–50. The slugified name must be unique among non-deleted webhooks. |
| `allowedActions` | array<string> | Required. At least one of `NEW_ORDER`, `CANCEL_ORDER`, `CLOSE_POSITION`. |

#### Success Response

| Status | Description |
|--------|-------------|
| `201`  | Webhook created |

`data` example:

```json
{
  "webhookUrl": "https://futuresbe.zebpay.com/webhooks/5a51b5ca-2998-4c16-8351-8b4d2584127f",
  "secret": "ab12cd34ef567890ab12cd34ef567890ab12cd34ef567890ab12cd34ef567890",
  "message": "Secret is shared one time only. Please save and send in future requests."
}
```

---

### <a id="list-webhooks"></a> List Webhooks

Returns all webhooks belonging to the authenticated account.

#### Request

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `GET` |
| **Endpoint Path** | `/webhooks` |
| **Auth Required** | Yes |

#### Success Response

| Status | Description |
|--------|-------------|
| `200`  | Success |

`data` example (truncated):

```json
[
  {
    "accountId": "12345",
    "webhookId": "5a51b5ca-2998-4c16-8351-8b4d2584127f",
    "webhookName": "TradingView Signals",
    "allowedActions": ["NEW_ORDER", "CANCEL_ORDER"],
    "isPaused": false,
    "createdAt": "2025-08-05T06:00:41.000Z",
    "updatedAt": "2025-08-05T06:00:41.000Z",
    "stats": {
      "NEW_ORDER": { "totalCount": 12, "successCount": 11 },
      "CANCEL_ORDER": { "totalCount": 2, "successCount": 2 },
      "CLOSE_POSITION": { "totalCount": 0, "successCount": 0 }
    }
  }
]
```

`stats` always includes every action, defaulting to zeros when no events have been recorded.

---

### <a id="update-webhook"></a> Update Webhook

Renames a webhook and merges additional actions into the existing allow-list.

#### Request

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `PATCH` |
| **Endpoint Path** | `/webhooks/:uuid` |
| **Auth Required** | Yes |

Body parameters (**both required**):

| Field | Type | Rules |
|-------|------|-------|
| `webhookName` | string | Required. Length 1–50. Must remain unique after slugify. |
| `allowedActions` | array<string> | Required. Non-empty. Unioned with the webhook's current actions; sending a subset does not remove existing actions. |

#### Success Response

| Status | Description |
|--------|-------------|
| `201`  | Webhook updated |

`data` example:

```json
{
  "webhookId": "5a51b5ca-2998-4c16-8351-8b4d2584127f",
  "accountId": "12345",
  "webhookName": "TradingView + Telegram",
  "allowedActions": ["NEW_ORDER", "CANCEL_ORDER", "CLOSE_POSITION"],
  "createdAt": "2025-08-05T06:00:41.000Z",
  "updatedAt": "2025-08-05T06:30:12.000Z"
}
```

---

### <a id="pause-webhook"></a> Pause Webhook

Disables a webhook without deleting it. Disabled webhooks ignore received callbacks.

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `PATCH` |
| **Endpoint Path** | `/webhooks/:uuid/pause` |
| **Auth Required** | Yes |

Success response: **`201 Created`**.

```json
{
  "webhookId": "5a51b5ca-2998-4c16-8351-8b4d2584127f",
  "accountId": "12345",
  "isPaused": true
}
```

---

### <a id="resume-webhook"></a> Resume Webhook

Re-enables a paused webhook.

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `PATCH` |
| **Endpoint Path** | `/webhooks/:uuid/resume` |
| **Auth Required** | Yes |

Success response: **`201 Created`**.

```json
{
  "webhookId": "5a51b5ca-2998-4c16-8351-8b4d2584127f",
  "accountId": "12345",
  "isPaused": false
}
```

---

### <a id="delete-webhook"></a> Delete Webhook

Deletes a webhook. Deleted webhooks no longer receive callbacks.

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `DELETE` |
| **Endpoint Path** | `/webhooks/:uuid` |
| **Auth Required** | Yes |

Success response: **`200 OK`**.

```json
{
  "webhookId": "5a51b5ca-2998-4c16-8351-8b4d2584127f",
  "accountId": "12345",
  "success": true
}
```

---

## Error Responses

Errors use the standard API envelope:

```json
{
  "statusDescription": "Forbidden action",
  "data": {},
  "statusCode": 403,
  "customMessage": [
    "Forbidden action"
  ]
}
```

Common cases:

| HTTP | Message |
|------|---------|
| 401 | `Unauthorized` |
| 400 | `allowedActions_empty` |
| 400 | `Webhook with name ... exists. Please try a different name` |
| 400 | `Webhook with a similar name ... exists. Please try a different name` |
| 403 | `Forbidden action` (webhook not found or not owned by the account) |
| 403 | `Account is blocked. Please contact customer support` |
| 403 | `User Account Inactive. Please contact customer support` |
| 403 | `Trading disabled for account. Please contact customer support` |
