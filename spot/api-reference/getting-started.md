# Getting Started with Zebpay Spot API

This guide will help you get started with the Zebpay Spot API. The API provides access to market data, trading, and account management functionality.

## Table of Contents
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Rate Limits](#rate-limits)
- [Error Handling](#error-handling)
- [Quick Start](#quick-start)

## Authentication

The Zebpay Spot API supports two authentication methods:

1. **JWT Authentication**
   - Use a JWT token for authentication
   - Token is passed in the Authorization header
   - Format: `Authorization: Bearer <jwt_token>`

2. **API Key Authentication**
   - Use API key and secret key for authentication
   - API key is passed in the `x-auth-apikey` header
   - Signature is passed in the `x-auth-signature` header
   - Timestamp is included in all requests

For detailed authentication information, see [Authentication Guide](./authentication.md).

## Base URL

The base URL for the Spot API is:
```
https://api.zebpay.com
```

## Rate Limits

The API has rate limits to ensure fair usage:
- Public endpoints: 1200 requests per minute
- Private endpoints: 600 requests per minute

For detailed rate limit information, see [Rate Limits Guide](./rate-limits.md).

## Error Handling

The API uses standard HTTP status codes and returns error messages in a consistent format:
```json
{
  "code": 400,
  "message": "Error description"
}
```

For detailed error handling information, see [Error Handling Guide](./error-handling.md).

## Quick Start

### 1. Install the Node.js Client

```bash
npm install @zebpay/spot-api-client
```

### 2. Initialize the Client

```javascript
const SpotApiClient = require('@zebpay/spot-api-client');

// Using JWT authentication
const client = new SpotApiClient({
  jwt: 'your-jwt-token'
});

// Or using API key authentication
const client = new SpotApiClient({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key'
});
```

### 3. Make API Calls

```javascript
// Get market data
const ticker = await client.getTicker('BTC-INR');
console.log('BTC-INR Ticker:', ticker);

// Get account balance
const balance = await client.getAccountBalance();
console.log('Account Balance:', balance);

// Place an order
const order = {
  symbol: 'BTC-INR',
  side: 'BUY',
  type: 'MARKET',
  quantity: '0.001'
};
const orderResult = await client.placeOrder(order);
console.log('Order Result:', orderResult);
```

### 4. Environment Setup

Create a `.env` file with your credentials:
```
JWT_TOKEN=your_jwt_token
# OR
API_KEY=your_api_key
SECRET_KEY=your_secret_key
```

For more examples, see the [run.example.js](../clients/rest-http/node/run.example.js) file.

## Next Steps

- Read the [Authentication Guide](./authentication.md) for detailed authentication information
- Check the [Public Endpoints](./public-endpoints/) for market data APIs
- Check the [Private Endpoints](./private-endpoints/) for trading and account APIs
- Review the [Data Models](./data-models.md) for API response formats 