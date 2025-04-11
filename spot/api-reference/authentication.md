# Authentication Guide

This guide explains the authentication methods supported by the Zebpay Spot API.

## Table of Contents
- [Authentication Methods](#authentication-methods)
- [JWT Authentication](#jwt-authentication)
- [API Key Authentication](#api-key-authentication)
- [Request Signing](#request-signing)
- [Security Best Practices](#security-best-practices)

## Authentication Methods

The Zebpay Spot API supports two authentication methods:

1. JWT Authentication
2. API Key Authentication

Choose the method that best suits your application's needs.

## JWT Authentication

JWT (JSON Web Token) authentication is simpler to implement and is recommended for most use cases.

### Implementation

1. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

2. Example using the Node.js client:
```javascript
const client = new SpotApiClient({
  jwt: 'your-jwt-token'
});
```

### JWT Token Format

The JWT token should be in the following format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## API Key Authentication

API Key authentication provides more control over request signing and is recommended for high-frequency trading applications.

### Implementation

1. Include the API key and signature in the request headers:
```
x-auth-apikey: <api_key>
x-auth-signature: <signature>
```

2. Example using the Node.js client:
```javascript
const client = new SpotApiClient({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key'
});
```

### Request Signing

For API Key authentication, each request must be signed using your secret key. The signature is generated as follows:

1. For GET requests:
   - Create a query string from the parameters
   - Add timestamp to the parameters
   - Generate HMAC SHA256 signature using the secret key

2. For POST/PUT/DELETE requests:
   - Add timestamp to the request body
   - Convert body to JSON string
   - Generate HMAC SHA256 signature using the secret key

Example signature generation:
```javascript
const crypto = require('crypto');

// For GET requests
const queryString = 'symbol=BTC-INR&timestamp=1234567890';
const signature = crypto
  .createHmac('sha256', secretKey)
  .update(queryString)
  .digest('hex');

// For POST requests
const body = JSON.stringify({
  symbol: 'BTC-INR',
  side: 'BUY',
  timestamp: Date.now()
});
const signature = crypto
  .createHmac('sha256', secretKey)
  .update(body)
  .digest('hex');
```

## Security Best Practices

1. **Keep Credentials Secure**
   - Never share your API keys or JWT tokens
   - Store credentials in environment variables
   - Use secure credential management systems

2. **Use HTTPS**
   - Always use HTTPS for API requests
   - Verify SSL certificates

3. **Implement Rate Limiting**
   - Respect API rate limits
   - Implement exponential backoff for retries

4. **Monitor API Usage**
   - Monitor your API usage
   - Set up alerts for unusual activity

5. **Regular Key Rotation**
   - Rotate API keys regularly
   - Revoke compromised keys immediately

6. **IP Whitelisting**
   - Use IP whitelisting when possible
   - Restrict API access to known IP addresses

## Error Handling

Authentication errors will return HTTP 401 status code with the following format:
```json
{
  "code": 401,
  "message": "Authentication failed"
}
```

Common authentication errors:
- Invalid JWT token
- Invalid API key
- Invalid signature
- Missing authentication headers
- Expired timestamp

For more information on error handling, see [Error Handling Guide](./error-handling.md). 