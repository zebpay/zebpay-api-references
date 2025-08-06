# API Reference: Webhook Management

These **private** endpoints let you create, view and maintain webhooks that will later receive trading-signal callbacks.

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
| `webhookName` | string | Human-readable label |
| `allowedActions` | array<string> | ≥ 1 item – values: `NEW_ORDER` `CANCEL_ORDER` `CLOSE_POSITION` |

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
| **Endpoint Path** | `//webhooks` |
| **Auth Required** | Yes |

#### Success Response

| Status | Description |
|--------|-------------|
| `200`  | Success |

`data` example (truncated):

```json
[
  {
    "webhookId": "5a51b5ca-2998-4c16-8351-8b4d2584127f",
    "webhookName": "TradingView Signals",
    "allowedActions": ["NEW_ORDER", "CANCEL_ORDER"],
    "isPaused": false,
    "createdAt": "2025-08-05T06:00:41.000Z",
    "updatedAt": "2025-08-05T06:00:41.000Z"
  }
]
```

---

### <a id="update-webhook"></a> Update Webhook

Renames a webhook and/or merges additional actions.

#### Request

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `PATCH` |
| **Endpoint Path** | `/webhooks/:uuid` |
| **Auth Required** | Yes |

Body parameters (all optional):

- `webhookName` (`string`)
- `allowedActions` (`array<string>`)

#### Success Response

| Status | Description |
|--------|-------------|
| `200`  | Success |

`data` example omitted for brevity (see *Create Webhook* response shape).

---

### <a id="pause-webhook"></a> Pause Webhook

Disables a webhook without deleting it. Disabled webhooks ignore received callbacks.

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `PATCH` |
| **Endpoint Path** | `/webhooks/:uuid/pause` |
| **Auth Required** | Yes |

Success response: `200` with `data = null`.

---

### <a id="resume-webhook"></a> Resume Webhook

Re-enables a paused webhook.

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `PATCH` |
| **Endpoint Path** | `/webhooks/:uuid/resume` |
| **Auth Required** | Yes |

Success response: `200` with `data = null`.


---

### <a id="delete-webhook"></a> Delete Webhook

Deletes a webhook. Deleted webhooks no longer receive callbacks.

| Attribute | Value |
|-----------|-------|
| **HTTP Method** | `DELETE` |
| **Endpoint Path** | `/:uuid` |
| **Auth Required** | Yes |

Success response: `200` with `data = null`.

---

## Error Responses

Errors follow the format:

```json
{
  "statusCode": 422,
  "message": "allowedActions_empty",
  "error": "Unprocessable Entity"
}
```

Common cases:

| HTTP | Message |
|------|---------|
| 401  | `Unauthorized` |
| 403  | `Forbidden` (invalid JWT or webhook not owned by account) |
| 422  | `allowedActions_empty` (validation) |
