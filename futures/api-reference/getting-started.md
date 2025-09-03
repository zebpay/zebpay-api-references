# Getting Started

Welcome to the Zebpay Futures REST API!

This guide walks you through the first steps of integrating with the API—whether you're working with one of our sample clients or directly via raw HTTP.

---

## 🚀 Recommended: Use our Sample Client Library

While direct HTTP access is supported, **the fastest and most reliable way to get started is by using one of our sample client libraries** for supported languages:

- [Node.js Client](https://github.com/zebpay/zebpay-api-references/tree/main/futures/clients/rest-http/node)
- [Python Client](https://github.com/zebpay/zebpay-api-references/tree/main/futures/clients/rest-http/python)

> ### ✅ Why use a client?
>
> - **No Manual Signing:** Automatically handles JWTs, HMAC signatures, and timestamps.
> - **Cleaner Code:** Removes repetitive boilerplate with convenient methods per endpoint.
> - **Fewer Errors:** Reduces chances of signature mismatches or malformed headers.
> - **Better Dev Experience:** Built-in types, code completion, and modern DX best practices.
>

---

## 🛠️ Direct HTTP Access

This section is for developers who prefer direct control over HTTP requests (e.g., for integrations, testing, or unsupported languages).

> ⚠️ **Note:** You'll need to manually implement the authentication logic. This involves constructing HMAC signatures, managing timestamps, and setting correct headers.
>
> 🔐 See: [Authentication Guide](https://github.com/zebpay/zebpay-api-references/blob/main/futures/api-reference/authentication.md)

---

## Step 1: Prerequisites

Before making your first call, ensure you have:

1. **HTTP client tool** — e.g., `curl`, Postman, Insomnia, or libraries like `axios` / `requests`.
2. **API base URL** — `https://futuresbe.zebpay.com`
3. **API credentials** — either:
   - A **JWT token** (for user session-based access)
   - Or an **API Key + Secret Key** pair (for programmatic access)

---

## Step 2: Try a Public API Call (No Auth Required)

Let’s query the market order book for a symbol.

### Example: `GET /api/v1/market/orderBook`

```bash
curl -X GET "https://api.zebapi.com/api/v1/market/orderBook?symbol=BTCUSDT" \
  -H "Accept: application/json"
```

✅ **No authentication required**

🔄 **Response Format:** [ApiResponse](../api-reference/data-models.md#apiresponse) with `data` as [OrderBook](../api-reference/data-models.md#orderbook)

---

## Step 3: Make Your First Private API Call (Requires Auth)

Let’s fetch your wallet balance.

### Endpoint: `GET /api/v1/wallet/balance`

Choose your preferred auth method:

---

### 🔑 Option 1: JWT Token

```bash
curl -X GET "https://api.zebapi.com/api/v1/wallet/balance" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

### 🔐 Option 2: API Key + Secret Key

To authenticate:

1. Generate a current `timestamp` in milliseconds.
2. Construct the correct `dataToSign` (query string or JSON body).
3. Generate an `HMAC-SHA256` signature using your Secret Key.
4. Include the headers:

```http
x-auth-apikey: <your_api_key>
x-auth-signature: <signature>
Accept: application/json
```

> 🧠 Full instructions: [Manual Authentication Guide](https://github.com/zebpay/zebpay-api-references/blob/main/futures/api-reference/authentication.md#manual-api-key--secret-authentication)

#### Example `curl` for API Key auth

```bash
curl -X GET "https://api.zebapi.com/api/v1/wallet/balance?timestamp=1712345678901" \
  -H "x-auth-apikey: YOUR_API_KEY" \
  -H "x-auth-signature: abcdef1234567890deadbeef..." \
  -H "Accept: application/json"
```

---

## 🧭 Next Steps

If you're using direct HTTP:

- 📚 **Explore the [API Reference](../api-reference)** for all endpoints.
- 🔍 **Review [Data Models](../api-reference/data-models.md)** to understand request/response shapes.
- 🚨 **Handle errors gracefully** with our [Error Handling Guide](./error-handling.md).

Or…

👉 **Skip the boilerplate** and start building faster with:
- [Node.js Client](../clients/rest-http/node)
- [Python Client](../clients/rest-http/python)

---

## 🤝 Support & Questions

Need help? Found an issue?

- Open an issue on our [GitHub repo](https://github.com/zebpay/zebpay-api-references)
- Reach out to us

Happy trading! 🛠️
