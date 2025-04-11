# Private Endpoints

This document describes the private endpoints available in the Zebpay Spot API. These endpoints require authentication using either JWT or API key authentication.

## Table of Contents
- [Account Management](#account-management)
- [Order Management](#order-management)

## Account Management

### Get Account Balance
Get the balance for specific assets or all assets.

**Endpoint:** `GET /api/v2/account/balance`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| x-auth-signature | Yes | Required for API key authentication |
| x-auth-timestamp | Yes | Required for API key authentication |

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | No | Trading pair symbol |
| currencies | string | No | Comma-separated list of currencies |

**Response:**
```json
[
  {
    "asset": "BTC",
    "free": "1.5",
    "locked": "0.5"
  }
]
```

## Order Management

### Place New Order
Place a new order.

**Endpoint:** `POST /api/v2/ex/orders`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| x-auth-signature | Yes | Required for API key authentication |
| x-auth-timestamp | Yes | Required for API key authentication |

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |
| side | string | Yes | Order side (BUY/SELL) |
| type | string | Yes | Order type |
| price | string | No | Order price |
| quantity | string | No | Order quantity |
| quoteOrderQty | string | No | Quote order quantity |
| stopPrice | string | No | Stop price |
| platform | string | No | Platform |

**Response:**
```json
{
  "orderId": "123456",
  "symbol": "BTC-INR",
  "side": "BUY",
  "type": "LIMIT",
  "price": "5500000",
  "quantity": "0.001",
  "status": "NEW",
  "time": 1612345678,
  "executedQty": "0",
  "cummulativeQuoteQty": "0"
}
```

### Get Orders
Get orders with optional filtering.

**Endpoint:** `GET /api/v2/ex/orders`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| x-auth-signature | Yes | Required for API key authentication |
| x-auth-timestamp | Yes | Required for API key authentication |

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |
| status | string | No | Order status (ACTIVE, FILLED, CANCELLED, PARTIALLY_FILLED) |
| currentPage | number | No | Current page number (default: 1) |
| pageSize | number | No | Number of records per page (default: 20) |

**Response:**
```json
{
  "orders": [
    {
      "orderId": "123456",
      "symbol": "BTC-INR",
      "side": "BUY",
      "type": "LIMIT",
      "price": "5500000",
      "quantity": "0.001",
      "status": "NEW",
      "time": 1612345678
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalRecords": 100
  }
}
```

### Get Order Details
Get details of a specific order.

**Endpoint:** `GET /api/v2/ex/orders/{orderId}`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| x-auth-signature | Yes | Required for API key authentication |
| x-auth-timestamp | Yes | Required for API key authentication |

**Response:**
```json
{
  "orderId": "123456",
  "symbol": "BTC-INR",
  "side": "BUY",
  "type": "LIMIT",
  "price": "5500000",
  "quantity": "0.001",
  "status": "FILLED",
  "time": 1612345678,
  "executedQty": "0.001",
  "cummulativeQuoteQty": "5500"
}
```

### Cancel Order
Cancel a specific order.

**Endpoint:** `DELETE /api/v2/ex/orders/{orderId}`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| x-auth-signature | Yes | Required for API key authentication |
| x-auth-timestamp | Yes | Required for API key authentication |

**Response:**
```json
{
  "orderId": "123456",
  "symbol": "BTC-INR",
  "status": "CANCELED"
}
```

### Cancel All Orders
Cancel all orders for a trading pair.

**Endpoint:** `DELETE /api/v2/ex/orders`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| x-auth-signature | Yes | Required for API key authentication |
| x-auth-timestamp | Yes | Required for API key authentication |

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |

**Response:**
```json
{
  "message": "All orders cancelled successfully"
}
```

### Get Order Fills
Get fills for a specific order.

**Endpoint:** `GET /api/v2/ex/orders/fills/{orderId}`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| x-auth-signature | Yes | Required for API key authentication |
| x-auth-timestamp | Yes | Required for API key authentication |

**Response:**
```json
[
  {
    "price": "5500000",
    "qty": "0.001",
    "commission": "5.5",
    "commissionAsset": "INR",
    "tradeId": "789012"
  }
]
``` 