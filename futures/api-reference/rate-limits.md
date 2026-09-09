# Rate Limits

To ensure fair usage and service stability, the ZebPay Futures REST API enforces rate limits on incoming `/api` requests.

## Rate Limit Rule

A single rate limit applies across public and private `/api` routes:

* **Tracker:** client IP address (applied before API-key or JWT authentication)
* **Values:** `config.apiRateLimit.limit` requests per `config.apiRateLimit.ttl` milliseconds in the deployed service

Per-route `@Throttle` annotations (including a 1 request/second wallet decorator) are overwritten by that shared configuration. Do not assume a 180 requests/minute budget, a per-API-key budget, or a stricter wallet limit.

## Exceeding the Limit

If your application exceeds the rate limit, the API responds with:

* **HTTP Status Code:** `429 Too Many Requests`
* **Response Body:** the standard [Error Response Structure](./error-handling.md#errorresponse), with:

```json
{
  "statusDescription": "Please note your API request has exceeded daily limits.",
  "data": {},
  "statusCode": 429,
  "customMessage": [
    "Please note your API request has exceeded daily limits."
  ]
}
```

The response does not include a `Retry-After` header.

Handle `429` by backing off before retrying. Continuously hitting the limit may lead to temporary IP blocking.

## Recommendations

* **Implement Backoff:** Wait before retrying after a `429`.
* **Optimize Calls:** Avoid unnecessary requests. Cache frequently accessed public data where appropriate.
