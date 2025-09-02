# Private Endpoints

This document describes the private endpoints available in the Zebpay Spot API. These endpoints require authentication using either JWT or API key authentication.

## Table of Contents
- [Authentication and Headers](#authentication-and-headers)
- [Account Management](#account-management)
- [Order Management](#order-management)

## Authentication and Headers

All private endpoints require authentication. You can authenticate using either API Key headers or a JWT token.

- API Key authentication:
  - `X-AUTH-APIKEY`: Your API key
  - `X-AUTH-SIGNATURE`: HMAC SHA256 signature. See Request Signing in the Authentication guide: /spot/api-reference/authentication.md#api-key-authentication

Notes:
- The headers above apply to all private endpoints.

## Account Management

### Get Account Balance
Get the balance for specific assets or all assets.

**Endpoint:** `GET /api/v2/account/balance`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | No | Trading pair symbol, e.g. "BTC-INR" |
| currencies | string | No | Comma-separated list of currencies, "BTC,ETH,INR"|

**Response:**
```json
{
  "data": [
    {
        "currency": "BTC",
        "total": "0.12345678",
        "free": "0.10000000",
        "used": "0.02345678",
        "usedInExchange": "0.01000000",
        "usedInQt": "0.00000000",
        "usedInLending": "0.00000000",
        "usedInTransfers": "0.01345678",
        "isFiat": false,
        "cryptoPackBalance": "0.00000000",
        "updatedAt": 1735872000000
    },
    {
        "currency": "INR",
        "total": "7383376.46",
        "free": "7365026.44",
        "used": "18350.02",
        "usedInExchange": "0",
        "usedInQt": "0",
        "usedInLending": "0",
        "usedInTransfers": "18350.02",
        "isFiat": true,
        "cryptoPackBalance": "0",
        "updatedAt": 1744362355956
    }
  ],
  "statusCode": 200,
  "statusDescription": "Success"
}
```

## Order Management

### Place New Order
Place a new order.

**Endpoint:** `POST /api/v2/ex/orders`

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |
| side | string | Yes | Order side (BUY/SELL) |
| type | string | Yes | Order type (LIMIT/MARKET/STOP_LIMIT)|
| price | string | No | Order price |
| amount | string | No | Order quantity |
| quoteOrderAmount | string | No | Quote order quantity |
| stopLossPrice | string | No | Stop price |
| clientOrderId | string | No | Client order ID must contain only letters, numbers, dots, colons, slashes, underscores, and hyphens, and be 1-36 characters long |
| platform | string | No | Platform |

**Response:**
```json
{
  "data": {
      "orderId": 6016691,
      "clientOrderId": "SKcbGT5MLDNv4sLkrjH9bA",
      "symbol": "BTC-INR",
      "type": "LIMIT",
      "side": "BUY",
      "price": "5333400",
      "amount" :  "0.0001",
      "quoteOrderAmount" :"0",
      "filled":"0",
      "remaining":"0",
      "status": "OPEN",
      "timeInForce": "GTC",
      "timestamp": 1744362483471
  },
  "statusCode": 200,
  "statusDescription": "Success"
}
```

### Get Orders
Get orders with optional filtering.

**Endpoint:** `GET /api/v2/ex/orders`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |
| status | string | No | Order status (ACTIVE, FILLED, CANCELLED) (default: ACTIVE)|
| currentPage | number | No | Current page number (default: 1) |
| pageSize | number | No | Number of records per page (default: 20) |
| startTime | number | No | Start time in milliseconds (default: 20) |
| endTime | number | No | End time in milliseconds (default: 20) |

**Response:**
```json
{
  "data": {
    "currentPage": 1,
    "pageSize": 100,
    "totalNum": 5,
    "totalPage": 1,
    "items": [
        {
          "orderId": 6004295,
          "clientOrderId": "SKcbGT5MLDNv4sLkrjH9bA",
          "symbol": "ETH-INR",
          "side": "BUY",
          "type": "LIMIT",
          "amount": "0.0001",
          "price": "533340",
          "timeInForce":"GTC",`
          "filled": "0",
          "remaining": "0",
          "status": "OPEN",
          "quoteOrderAmount" :"0",
          "feeCurrency": "INR",
          "fees": "0",
          "tax": "0",
          "tds": "0",
          "avgExecutedPrice": "0",
          "timestamp": 1744284283839,
        }
      ]
    },
    "statusCode": 200,
    "statusDescription": "Success"
}
```

### Get Order Details
Get details of a specific order.

**Endpoint:** `GET /api/v2/ex/order`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | Order Id |

**Response:**
```json
{
    "data": {
        "orderId": 987654,
        "clientOrderId": "SKcbGT5MLDNv4sLkrjH9bA",
        "timestamp": 1735872000000,
        "symbol": "ETH-INR",
        "type": "LIMIT",
        "timeInForce": "GTC",
        "side": "BUY",
        "price": "2000.00",
        "amount": "0.5",
        "filled": "0.5",
        "remaining": "0",
        "quoteOrderAmount": "0",
        "feeCurrency": "INR",
        "avgExecutedPrice": "2000.00",
        "fees": "1.23",
        "tax": "0.00",
        "tds": "0.00",
        "status": "FILLED"
    },
    "statusCode": 200,
    "statusDescription": "Success"
}
```

### Cancel Order
Cancel a specific order.

**Endpoint:** `DELETE /api/v2/ex/order`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | Order Id |

**Response:**
```json
{
  "data": {
      "orderId": 6016691,
      "symbol": "BTC-INR",
      "status": "CANCELLED"
  },
  "statusCode": 200,
  "statusDescription": "Success"
}
```

### Cancel All Orders for a symbol
Cancel all orders for a trading pair.

**Endpoint:** `DELETE /api/v2/ex/orders`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol, e.g "BTC-INR" |

**Response:**
```json
{
    "data": [
        { "orderId": 6016691, "symbol": "ETH-INR", "status": "CANCELLED" },
        { "orderId": 6016692, "symbol": "ETH-INR", "status": "CANCELLED" }
    ],
    "statusCode": 200,
    "statusDescription": "Success"
}
```


### Cancel All Orders
Cancel all orders

**Endpoint:** `DELETE /api/v2/ex/orders/cancelAll`


**Response:**
```json
{
    "data": [
        { "orderId": 5016691, "symbol": "ETH-INR", "status": "CANCELLED" },
        { "orderId": 4016692, "symbol": "BTC-INR", "status": "CANCELLED" }
    ],
    "statusCode": 200,
    "statusDescription": "Success"
}
```

### Get Order Fills
Get fills for a specific order.

**Endpoint:** `GET /api/v2/ex/order/fills`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | Order Id |

**Response:**
```json
{
    "data": {
        "orderId": 987654,
        "clientOrderId": "abc-123",
        "timestamp": 1735872000000,
        "symbol": "ETH-INR",
        "type": "LIMIT",
        "timeInForce": "GTC",
        "side": "BUY",
        "price": "2000.00",
        "amount": "0.5",
        "filled": "0.5",
        "remaining": "0.0",
        "quoteOrderAmount": "0",
        "feeCurrency": "INR",
        "avgExecutedPrice": "1998.00",
        "fees": "2.00",
        "tax": "0.00",
        "tds": "0.00",
        "status": "COMPLETED",
        "fills": [
            {
                "amount": "0.25",
                "price": "1999.00",
                "cost": "499.75",
                "fees": "1.00",
                "intradayFees": "0.00",
                "tax": "0.00",
                "tds": "0.00",
                "totalFees": "1.00",
                "feeCurrency": "INR",
                "createdAt": 1735872000000,
                "isMaker": true
            }
        ]
        },
    "statusCode": 200,
    "statusDescription": "Success"
}
``` 

### Get Exchange fee
Get Exchange fee details

**Endpoint:** `GET /api/v2/ex/myfee/{symbol}`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| side | string | Yes | Order side (BUY,SELL) |

**Response:**
```json
{
    "data": {
        "symbol": "ETH-INR",
        "takerFeeRate": "0.15",
        "makerFeeRate": "0.10",
        "percentage": true,
        "gst": "0.00",
        "tds": "0.00"
    },
    "statusCode": 200,
    "statusDescription": "Success"
}
``` 