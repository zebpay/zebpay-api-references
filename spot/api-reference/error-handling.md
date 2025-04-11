# Error Handling Guide

This guide explains how to handle errors when using the Zebpay Spot API.

## Table of Contents
- [Error Response Format](#error-response-format)
- [HTTP Status Codes](#http-status-codes)
- [Error Codes](#error-codes)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Error Response Format

All error responses follow this format:
```json
{
  "code": 400,
  "message": "Error description"
}
```

## HTTP Status Codes

The API uses standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Error Codes

Common error codes and their meanings:

| Code | Description | Resolution |
|------|-------------|------------|
| 1000 | Invalid request parameters | Check parameter format and values |
| 1001 | Missing required parameter | Include all required parameters |
| 1002 | Invalid parameter value | Check parameter value constraints |
| 2000 | Authentication failed | Check credentials and signature |
| 2001 | Invalid API key | Verify API key |
| 2002 | Invalid signature | Check signature generation |
| 2003 | Expired timestamp | Ensure timestamp is current |
| 3000 | Insufficient balance | Check account balance |
| 3001 | Invalid order type | Check order type value |
| 3002 | Invalid order side | Check order side value |
| 3003 | Invalid order quantity | Check quantity constraints |
| 3004 | Invalid order price | Check price constraints |
| 4000 | Rate limit exceeded | Implement rate limiting |
| 5000 | Internal server error | Contact support |
| 5001 | Service unavailable | Retry after some time |

## Best Practices

1. **Error Handling**
   - Always check response status codes
   - Parse error messages for user feedback
   - Log errors for debugging

2. **Retry Logic**
   - Implement exponential backoff
   - Retry only on specific error codes
   - Set maximum retry attempts

3. **Rate Limiting**
   - Monitor rate limit headers
   - Implement request queuing
   - Respect rate limits

4. **Validation**
   - Validate parameters before sending
   - Check response data types
   - Handle null/undefined values

## Examples

### Node.js Client Error Handling

```javascript
try {
  const response = await client.getTicker('BTC-INR');
  console.log('Ticker:', response);
} catch (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error status:', error.response.status);
    console.error('Error data:', error.response.data);
    
    // Handle specific error codes
    switch (error.response.data.code) {
      case 2000:
        console.error('Authentication failed');
        break;
      case 4000:
        console.error('Rate limit exceeded');
        break;
      case 5000:
        console.error('Internal server error');
        break;
      default:
        console.error('Unknown error');
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up request:', error.message);
  }
}
```

### Retry Logic Example

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Only retry on specific error codes
      if (![4000, 5000, 5001].includes(error.response?.data?.code)) {
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}

// Usage
try {
  const response = await retryWithBackoff(() => client.getTicker('BTC-INR'));
  console.log('Ticker:', response);
} catch (error) {
  console.error('Failed after retries:', error);
}
```

### Rate Limit Handling

```javascript
class RateLimiter {
  constructor(limit, interval) {
    this.limit = limit;
    this.interval = interval;
    this.queue = [];
    this.count = 0;
    this.lastReset = Date.now();
  }

  async acquire() {
    return new Promise(resolve => {
      this.queue.push(resolve);
      this.process();
    });
  }

  process() {
    const now = Date.now();
    if (now - this.lastReset >= this.interval) {
      this.count = 0;
      this.lastReset = now;
    }

    while (this.queue.length > 0 && this.count < this.limit) {
      this.count++;
      const resolve = this.queue.shift();
      resolve();
    }
  }
}

// Usage
const limiter = new RateLimiter(1200, 60000); // 1200 requests per minute

async function makeRequest() {
  await limiter.acquire();
  return client.getTicker('BTC-INR');
}
``` 