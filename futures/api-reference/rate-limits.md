# Rate Limits

To ensure fair usage and service stability, the ZebPay Futures REST API enforces rate limits on incoming `/api` requests.

## Rate Limit Rule

A single rate limit applies across public and private `/api` routes:

* **Tracker:** client IP address (applied before API-key or JWT authentication)
* **Production:** **180 requests per 60 seconds** per client IP
* **Not** a per-API-key or per-route budget. Per-route `@Throttle` annotations (including a 1 request/second wallet decorator) are overwritten by this shared limit.

Non-production environments may use a tighter budget. `GET /api/v1/market/markets` reports the active budget in `data.rateLimits`. Production advertises:

```json
{
  "rateLimitType": "REQUESTS",
  "interval": "SECOND",
  "intervalNum": 60,
  "limit": 180
}
```

## Exceeding the Limit

If your application exceeds the rate limit, the API responds with:

* **HTTP Status Code:** `429 Too Many Requests`
* **Retry-After:** remaining window in seconds (60 in production when the window has just been exhausted)
* **Response Body:** the standard [Error Response Structure](./error-handling.md#errorresponse), with:

```json
{
  "statusDescription": "Too many requests. Limit 180 requests per 60 seconds.",
  "data": {},
  "statusCode": 429,
  "customMessage": [
    "Too many requests. Limit 180 requests per 60 seconds."
  ]
}
```

Handle `429` by backing off before retrying, preferably until `Retry-After` elapses. Continuously hitting the limit may lead to temporary IP blocking.

## Recommendations

* **Implement Backoff:** Wait before retrying after a `429`.
* **Optimize Calls:** Avoid unnecessary requests. Cache frequently accessed public data where appropriate.
