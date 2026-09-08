# Authentication

To access private endpoints—such as those related to account balances, order management, or trading—you must authenticate your requests. Public endpoints (like order book, tickers, and exchange info) do **not** require authentication.

This API supports two authentication methods:

1. **JWT (JSON Web Token)**
2. **API Key + Secret Key**

You may authenticate requests using either method, depending on your application setup.

---

## 1. JWT Authentication

JWTs are self-contained tokens that securely represent a user or session.

### How It Works

1. Obtain a valid JWT token (usually via login or an authentication flow).
2. For every request to a private endpoint, attach the token to the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

### Example cURL Request

```bash
curl -X GET 'https://futuresbe.zebpay.com/api/v1/wallet/balance' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Accept: application/json'
```

> ✅ **Tip:** Use JWT when you're authenticating user sessions in web or mobile applications.

---

## 2. API Key + Secret Key Authentication

This method is ideal for programmatic access or server-to-server integrations.

### How It Works

Each request to a private endpoint must be signed with an `HMAC-SHA256` signature using your `Secret Key`. The signature is validated server-side to ensure integrity and authenticity.

Create and manage Futures API credentials in the **API Trading** section of the [ZebPay API portal](https://api.zebpay.com). The secret is shown when the key is created and must be stored securely.

### API Key Scopes

API-key authorization is separate from signature validation. A correctly signed request is still rejected with `403 Forbidden` when the key lacks the required scope.


| Scope             | Access                                                                               |
| ----------------- | ------------------------------------------------------------------------------------ |
| `fetch:details`   | Read-only private data, including balances, orders, positions, leverage, and history |
| `futures:trading` | Futures trade reads and all write operations                                         |


- REST write operations—including create, edit, cancel, add TP/SL, margin changes, closing positions, and leverage updates—require `futures:trading`.
- REST read endpoints accept either `fetch:details` or `futures:trading`.
- A key with `futures:trading` can therefore perform the currently documented REST reads and writes.
- The [private Futures WebSocket](./websocket/authentication.md) API-key handshake requires `fetch:details`. A single key intended for both full REST trading and private WebSocket events should have both scopes.
- JWT-authenticated requests do not use API-key scope checks.

### Account and Key Requirements

In addition to the key scope:

- Futures trading must be available for the account.
- Creating a new entry order—including stop and bracket entries—requires completed KYC and bank verification.
- Order and position management remains subject to scope, ownership, subaccount, and endpoint-specific state checks. The entry-order KYC/bank gate does not apply to private reads or risk-reducing management such as adding or editing protective TP/SL, cancelling an existing order, or closing an existing position.
- If the key has an IP allowlist, requests must originate from an allowed IP.
- Subaccount requests use the `subaccountid` header. The subaccount must belong to the root account, must not be frozen, and must have Futures permission enabled by the main account.

### Required Headers


| Header             | Value                 |
| ------------------ | --------------------- |
| `x-auth-apikey`    | Your API Key          |
| `x-auth-signature` | HMAC-SHA256 signature |
| `Content-Type`     | `application/json`    |
| `Accept`           | `application/json`    |


---

## Manual HTTP Authentication

This section is for developers not using the sample client libraries.

> 💡 **Recommendation:** Use the [Node.js Client](https://github.com/zebpay/zebpay-api-references/tree/main/futures/clients/rest-http/node) or [Python Client](https://github.com/zebpay/zebpay-api-references/tree/main/futures/clients/rest-http/python) to avoid handling these steps manually.

### Manual JWT Authentication

1. **Obtain JWT Token**
2. **Add Header**

```http
Authorization: Bearer <your_jwt_token>
```

That’s it. This header must be included in all authenticated requests.

---

### Manual API Key + Secret Authentication

Here’s a step-by-step guide:

#### Step 1: Retrieve your credentials

- `API Key`
- `Secret Key`

> 🔒 Keep your `Secret Key` safe! Never expose it publicly.
>
> For trade writes, ensure the key includes the `futures:trading` scope.

#### Step 2: Generate `timestamp`

Use the current Unix timestamp **in milliseconds**.

- JavaScript: `Date.now()`
- Python: `int(time.time() * 1000)`

Let’s call this value `timestamp`.

> 🕒 Ensure your system clock is reasonably accurate. Small clock drifts may cause signature errors or request rejections.

#### Step 3: Construct `dataToSign`

- For **GET** requests:
  - Append `timestamp` to your query parameters
  - Sign the query string exactly as it will be transmitted, preserving parameter order and URL encoding
  - Example:
    ```
    symbol=BTCUSDT&timestamp=1712345678901
    ```
  - This full query string becomes your `dataToSign`.
- For **POST/PUT/PATCH/DELETE** requests:
  - Add `timestamp` to the root level of your JSON body.
  - Serialize the full object into a **compact** JSON string (no extra whitespace).
  - This JSON string becomes your `dataToSign`.
  - Send the exact compact JSON string that was signed. This applies equally to `PATCH` and `DELETE` requests.

#### Step 4: Generate HMAC Signature

Use `HMAC-SHA256` with your `Secret Key` and the `dataToSign` from Step 3.

- Output should be a **lowercase hexadecimal** string.
- Let’s call this the `signature`.

Example (Node.js):

```js
const crypto = require('crypto');

function generateSignature(secret, dataToSign) {
  return crypto.createHmac('sha256', secret)
    .update(dataToSign)
    .digest('hex');
}
```

#### Step 5: Add headers to your HTTP request

```http
x-auth-apikey: <your_api_key>
x-auth-signature: <signature>
Content-Type: application/json
Accept: application/json
```

---

### Example (Signed GET Request)

```bash
curl -X GET "https://futuresbe.zebpay.com/api/v1/trade/history?symbol=BTCUSDT&timestamp=1712345678901" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: abcdef1234567890deadbeef..." \
  -H "Accept: application/json"
```

---

### Example (Signed POST Request)

```bash
curl -X POST "https://futuresbe.zebpay.com/api/v1/trade/order" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: abcdef1234567890deadbeef..." \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
        "symbol": "BTCUSDT",
        "type": "LIMIT",
        "side": "BUY",
        "price": 65000,
        "amount": 0.01,
        "timestamp": 1712345678901
      }'
```

---

## Troubleshooting Authorization


| Response                                          | Typical cause                                                  |
| ------------------------------------------------- | -------------------------------------------------------------- |
| `400 Invalid or expired timestamp`                | Missing timestamp, wrong units, or excessive clock skew        |
| `400 Invalid signature`                           | Signed bytes do not match the transmitted query/body           |
| `403 You do not have the required scope...`       | API key is missing the required scope                          |
| `403 You are not allowed API access from this ip` | Request IP is not on the key allowlist                         |
| `403 Forbidden request`                           | Invalid subaccount access or resource ownership/access failure |


Authentication proves who is calling. It does not override pair capabilities, account eligibility, or ownership checks.

---

## Security Best Practices

- ✅ **Use environment variables** to store API keys and secrets.
- ❌ **Never hardcode secrets** in source files or commit them to Git.
- 🔐 **Restrict API Key permissions** to only the scopes you need.
- 🔄 **Rotate keys regularly** and revoke any that may be compromised.

---

## 🔗 Helpful Links

- 📘 [Futures Private Endpoints Reference](https://github.com/zebpay/zebpay-api-references/tree/main/futures/api-reference/private-endpoints)
- 🧪 [Node.js Client Code](https://github.com/zebpay/zebpay-api-references/tree/main/futures/clients/rest-http/node)
- 🧪 [Python Client Code](https://github.com/zebpay/zebpay-api-references/tree/main/futures/clients/rest-http/python)
- 🗃️ [ZebPay API GitHub Monorepo (Root)](https://github.com/zebpay/zebpay-api-references/)
