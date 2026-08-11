# Rate Limits

To ensure fair usage and service stability, the ZebPay Futures REST API enforces rate limits on incoming requests.

## Rate Limit Rule

A general rate limit applies across **all** public and private API endpoints:

* **Limit:** **180 requests per minute** (equivalent to **3 requests per second**)

This limit generally applies per user account or API key for authenticated (private) endpoints, and potentially per IP address for public endpoints.

Some endpoints have stricter limits. `GET /api/v1/wallet/balance` is limited to one request per second.

## Exceeding the Limit

If your application exceeds the rate limit, the API will respond with:

* **HTTP Status Code:** `429 Too Many Requests`
* **Response Body:** Typically contains an error message indicating the rate limit has been exceeded, following the standard [Error Response Structure](./error-handling.md#errorresponse).
* **`Retry-After` Header (Optional):** The response *may* include a `Retry-After` header indicating how many seconds you should wait before attempting another request.

Your application should be designed to handle `429` responses gracefully, typically by implementing an exponential backoff strategy (waiting for the duration specified in `Retry-After` or a default period before retrying). Continuously hitting the rate limit may lead to temporary IP or key blocking.

## Recommendations

* **Implement Backoff:** Handle `429` responses by waiting before retrying.
* **Optimize Calls:** Avoid making unnecessary requests. Cache frequently accessed, non-critical data (especially from public endpoints) where appropriate.
