# Rate Limits Guide

This guide explains the rate limits for the Zebpay Spot API and how to handle them.

## Table of Contents
- [Rate Limit Overview](#rate-limit-overview)
- [Rate Limit Headers](#rate-limit-headers)
- [Rate Limit Categories](#rate-limit-categories)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Rate Limit Overview

The Zebpay Spot API implements rate limits to ensure fair usage and system stability. Rate limits are applied per API key or JWT token.

### Default Rate Limits

| Category | Limit | Window |
|----------|-------|--------|
| Public Endpoints | 1200 requests | 1 minute |
| Private Endpoints | 600 requests | 1 minute |

## Rate Limit Headers

The API includes rate limit information in response headers:

| Header | Description |
|--------|-------------|
| `x-ratelimit-limit` | Maximum number of requests allowed in the window |
| `x-ratelimit-remaining` | Number of requests remaining in the current window |
| `x-ratelimit-reset` | Unix timestamp when the rate limit window resets |

Example headers:
```
x-ratelimit-limit: 1200
x-ratelimit-remaining: 1195
x-ratelimit-reset: 1612345678
```

## Rate Limit Categories

### 1. Public Endpoints
- Market data endpoints
- System status endpoints
- Trading pair information
- Rate limit: 1200 requests per minute

### 2. Private Endpoints
- Account management
- Order management
- Trade execution
- Rate limit: 600 requests per minute

## Best Practices

1. **Monitor Rate Limits**
   - Check rate limit headers in responses
   - Track remaining requests
   - Plan request timing

2. **Implement Backoff**
   - Use exponential backoff
   - Respect rate limit reset times
   - Queue requests when needed

3. **Optimize Requests**
   - Batch requests when possible
   - Use websockets for real-time data
   - Cache responses when appropriate

4. **Error Handling**
   - Handle 429 status code
   - Implement retry logic
   - Log rate limit events

## Examples

### Monitoring Rate Limits

```javascript
async function makeRequest() {
  const response = await client.getTicker('BTC-INR');
  
  // Check rate limit headers
  const limit = response.headers['x-ratelimit-limit'];
  const remaining = response.headers['x-ratelimit-remaining'];
  const reset = response.headers['x-ratelimit-reset'];
  
  console.log(`Rate limit: ${remaining}/${limit} requests remaining`);
  console.log(`Reset time: ${new Date(reset * 1000)}`);
  
  return response.data;
}
```

### Rate Limit Queue

```javascript
class RateLimitQueue {
  constructor(limit, interval) {
    this.limit = limit;
    this.interval = interval;
    this.queue = [];
    this.count = 0;
    this.lastReset = Date.now();
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
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
      const { request, resolve, reject } = this.queue.shift();
      request()
        .then(resolve)
        .catch(reject);
    }
  }
}

// Usage
const queue = new RateLimitQueue(1200, 60000);

async function makeRequest() {
  return queue.add(() => client.getTicker('BTC-INR'));
}
```

### Exponential Backoff

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
      
      if (error.response?.status === 429) {
        // Rate limit exceeded
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = resetTime * 1000 - Date.now();
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        // Other error, use exponential backoff
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
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