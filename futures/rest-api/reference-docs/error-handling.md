# Error Handling

The Zebpay Futures REST API uses standard HTTP status codes to indicate the success or failure of a request. When an error occurs, the API typically returns a 4xx (client error) or 5xx (server error) status code along with a JSON body containing details about the error.

## Common HTTP Status Codes

Your application should be prepared to handle the following common HTTP status codes:

| Status Code          | Meaning                | Typical Cause / Notes                                                                                                      |
| :------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `200 OK`             | Success                | The request was successful (for GET, PUT, DELETE).                                                                         |
| `201 Created`        | Success                | The resource was successfully created (often for POST requests). *(Check specific endpoint docs; some POSTs may return 200)*. |
| `400 Bad Request`    | Client Error           | Malformed request (missing parameters, invalid values, incorrect JSON). Check response body for details.                 |
| `401 Unauthorized`   | Client Error           | Authentication failed (missing/invalid/expired JWT or API Key/Secret signature). Verify credentials/auth logic.              |
| `403 Forbidden`      | Client Error           | Authentication succeeded, but the user/key lacks permission for the requested action/resource.                           |
| `404 Not Found`      | Client Error           | The requested resource or endpoint path could not be found.                                                              |
| `429 Too Many Requests`| Client Error           | Rate limit exceeded. Check the `Retry-After` header (if present) and implement backoff. See [Rate Limits](./rate-limits.md). |
| `500 Internal Server Error` | Server Error         | An unexpected error occurred on the server side. Retrying later might resolve temporary issues.                              |
| `502 Bad Gateway`    | Server Error         | Server received an invalid response from an upstream server while acting as a gateway/proxy. Issue is likely upstream. Retrying later might help. |
| `503 Service Unavailable` | Server Error         | Server is temporarily unable to handle the request (maintenance, overload). Retrying later is recommended.                 |
| `504 Gateway Timeout`| Server Error         | Server did not receive a timely response from an upstream server while acting as a gateway/proxy. Retrying later might help.   |

## <a id="errorresponse"></a>Standard Error Response Format

When the API encounters an error it can handle (including validation errors, authentication issues, or internal errors caught by the system), it returns a standardized JSON response body along with the appropriate HTTP status code (4xx or 5xx).

**Fields:**

| Field Name        | Type           | Description                                                                                     |
| :---------------- | :------------- | :---------------------------------------------------------------------------------------------- |
| `statusDescription`| `string`       | A human-readable description of the error message [cite: Response interceptor Code].                             |
| `data`            | `object`       | Typically an empty object `{}`. In specific error cases (like `/user/status`), it might contain default values [cite: Response interceptor Code]. |
| `statusCode`      | `number`       | The HTTP status code reflecting the error type (e.g., 400, 401, 429, 500) [cite: Response interceptor Code].        |
| `customMessage`   | `Array<string>`| An array typically containing the same message(s) as `statusDescription` [cite: Response interceptor Code].        |

##### Example (400 Bad Request)

```json
{
  "statusDescription": "Invalid symbol parameter provided.",
  "data": {},
  "statusCode": 400,
  "customMessage": [
    "Invalid symbol parameter provided."
  ]
}
````

##### Example (500 Internal Server Error)

```json
{
  "statusDescription": "Internal server error",
  "data": {},
  "statusCode": 500,
  "customMessage": [
    "Internal server error"
  ]
}
```

## Client-Side Handling Recommendations

  * **Check Status Codes:** Always verify the HTTP status code of the response before attempting to process the body.
  * **Parse Error Body:** For 4xx/5xx responses, parse the JSON error body according to the structure defined above to extract the `statusDescription` or `customMessage` for logging or user feedback.
  * **Implement Retries:** For transient errors like `429 Too Many Requests`, `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, or `504 Gateway Timeout`, implement a retry mechanism, preferably with exponential backoff.
  * **Logging:** Log relevant error information (status code, response body, request details if possible) to aid in debugging.
  * **Client Libraries:** If using the sample [Node.js](../clients/http/node/README.md) or [Python](../clients/http/python/README.md) clients, they typically abstract some of this by throwing language-specific exceptions containing the error details. Refer to the specific client documentation for details.
