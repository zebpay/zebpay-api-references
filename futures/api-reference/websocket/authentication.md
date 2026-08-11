# Private WebSocket Authentication

Authentication credentials are supplied through the Socket.IO handshake `auth` object. Do not place API secrets in the URL, query string, or event payloads.

## API Key + Secret

Use this method to connect without a web-session JWT.

### Required API-key Scope

The API key must include:

```text
fetch:details
```

An API key containing only `futures:trading` is rejected by the private WebSocket service. A single key used for full REST trading and private WebSocket events should include both `futures:trading` and `fetch:details`.

API-key IP allowlists are enforced during the WebSocket handshake.

### Root-account Handshake

Create a current Unix timestamp in milliseconds and sign this exact compact JSON:

```json
{"timestamp":1750000000000}
```

Generate the lowercase or uppercase hexadecimal HMAC-SHA256 digest using the API secret, then connect with:

```javascript
{
  clientType: "api",
  apiKey: "YOUR_API_KEY",
  signature: "64_CHARACTER_HEX_HMAC",
  timestamp: 1750000000000
}
```

`timestamp` must be a JSON number and a safe integer. It must be within the server-configured timestamp window, so generate it immediately before connecting.

### Subaccount Handshake

For a subaccount, sign this exact compact JSON with the fields in this order:

```json
{"timestamp":1750000000000,"subaccountId":"456"}
```

Send the same string value in the handshake:

```javascript
{
  clientType: "api",
  apiKey: "YOUR_API_KEY",
  signature: "64_CHARACTER_HEX_HMAC",
  timestamp: 1750000000000,
  subaccountId: "456"
}
```

The HMAC fails if `subaccountId` is sent but omitted from the signed payload, or if its type or value differs.

### HMAC Algorithm

```text
signature = HEX(HMAC_SHA256(apiSecret, compactJsonPayload))
```

Do not sign the namespace URL, Socket.IO path, API key, or any wrapper object.

## JWT Compatibility

JWT authentication remains available:

```javascript
// API-token JWT
{ clientType: "api", token: "YOUR_API_JWT" }

// UI/web-session JWT; clientType defaults to "ui" when omitted
{ clientType: "ui", token: "YOUR_UI_JWT" }
```

Authentication selection is strict:

- HMAC is selected only when `clientType` is exactly `"api"`, `apiKey` is present, and `token` is absent.
- If both `token` and API-key fields are supplied, JWT takes precedence.
- An invalid JWT does not fall back to HMAC.
- Any `clientType` value other than `"api"` is treated as `"ui"`.

For API-key-only operation, omit `token` entirely.

### Exact Handshake Shape

Handshake field names and placement are strict:

- Put credentials in the Socket.IO `auth` object; URL/query credentials are not used by application authentication.
- Use exact camelCase `clientType`. Aliases such as `client_type`, misspellings, or different casing are not accepted.
- For API-key authentication, `clientType` must be exact lowercase `"api"`. If it is omitted or different, the connection follows the UI/JWT path and API-key fields do not authenticate it.
- Connect to the `/auth-stream` namespace. A wrong or unavailable namespace fails through `connect_error` before this authentication handler runs.

Invalid auth-object shape on a valid namespace produces `auth.error` followed by disconnect. Namespace or transport failures produce `connect_error` instead.

## Subaccount Requirements

The root account is used when `subaccountId` is omitted or empty. A selected subaccount must:

- Be a numeric account ID.
- Belong to the authenticated root account.
- Not be frozen.
- Have Futures permission granted by the main account.

The root account must have completed KYC.

## Authentication Events



### `auth.ok`

Emitted after authentication and account resolution succeed:

```json
{
  "rootAccountId": "123",
  "accountId": "456",
  "lpAccountId": "lp-account-id"
}
```

For a root-account connection, `rootAccountId` and `accountId` are the same.

### `auth.error`

Emitted when authentication or account resolution fails, immediately before the server disconnects:

```json
{
  "code": 403,
  "message": "You do not have the required scope to access this resource."
}
```

Common failures include:


| Message                                       | Cause                                                               |
| --------------------------------------------- | ------------------------------------------------------------------- |
| `API key or signature mismatching`            | Missing API key or signature                                        |
| `Invalid signature`                           | Signature is malformed or does not match the compact payload        |
| `Invalid or expired timestamp`                | Timestamp has the wrong type, is stale, or is too far in the future |
| `Invalid API key`                             | API key was not found or has no account                             |
| `You do not have the required scope...`       | API key lacks `fetch:details`                                       |
| `You are not allowed API access from this ip` | Caller IP is not on the key allowlist                               |
| `Account is pending KYC...`                   | Root account has not completed KYC                                  |
| `Forbidden`                                   | Requested subaccount does not belong to the root account            |
| `Sub-account is frozen...`                    | Selected subaccount is frozen                                       |
| `Sub-account lacks permission...`             | Futures permission is missing on the subaccount                     |


Listen for both `auth.error` and Socket.IO `connect_error`. `connect_error` covers protocol, transport, CORS, and namespace routing failures that can occur before the application authentication handler runs.

## Subsequent Explicit Connections

The sample clients do not retry automatically. If the caller explicitly connects again, generate a new handshake rather than reusing a prior timestamp and signature; a previously valid HMAC expires once it falls outside the server timestamp window.