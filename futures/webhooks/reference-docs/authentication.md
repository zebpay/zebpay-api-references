# Authentication (Webhooks)

Webhooks use two distinct authentication mechanisms—one for **management REST endpoints** (create, list, pause …) and one for the **event listener** that receives trading signals.

---

## 1. Management API (Bearer JWT)

Management routes are standard private REST endpoints that will eventually be surfaced through the Futures UI. Every request **must** carry a valid JSON Web Token (JWT):

```http
Authorization: Bearer <your_jwt_token>
```

All webhook records are scoped to the account encoded in the JWT. A missing or invalid token results in `401 Unauthorized`.

> ✅ **Tip:** Re-use the same JWT you already employ for placing orders via the private REST API.

---

## 2. Event Listener (Secret + Timestamp)

The callback endpoint (`POST /webhooks/:uuid`) does **not** rely on HTTP headers for auth. Instead, two mandatory fields inside the JSON body are validated:

| Field       | Type                | Purpose                                                      |
|-------------|---------------------|--------------------------------------------------------------|
| `secret`    | 64-char **hex**     | Raw secret returned **once** during webhook creation.        |
| `timestamp` | ISO-8601 UTC string | Must be within ±5 minutes of server time (replay protection). |

Requests failing either check are rejected with `403 Forbidden`.

Example minimal envelope:

```json
{
  "action": "<ACTION_NAME>",
  "payload": {},
  "secret": "ab12cd34ef567890ab12cd34ef567890ab12cd34ef567890ab12cd34ef567890",
  "timestamp": "2025-08-05T12:34:56Z"
}
```

> 🔒 **Security Reminder:** Store the secret securely. It is shown **only once**—during the `Create Webhook` response.
