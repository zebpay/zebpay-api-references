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
| X-AUTH-APIKEY | Yes | Required for API key authentication |
| X-AUTH-SIGNATURE | Yes | Required for API key authentication |

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | No | Trading pair symbol |
| currencies | string | No | Comma-separated list of currencies |

**Response:**
```json
{
  "data": [
    {
        "currency": "BTC",
        "balance": "1.14527466",
        "available": "1.14237653",
        "locked": "0.00289813",
        "lockedInExchange": "0",
        "lockedInQt": "0",
        "lockedInLending": "0.0021982",
        "lockedInTransfers": "0.00069993",
        "isFiat": false,
        "cryptoPackBalance": "0.06670147",
        "updatedAt": 1744362355956
    },
    {
        "currency": "INR",
        "balance": "7383376.46",
        "available": "7365026.44",
        "locked": "18350.02",
        "lockedInExchange": "0",
        "lockedInQt": "0",
        "lockedInLending": "0",
        "lockedInTransfers": "18350.02",
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

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| X-AUTH-APIKEY | Yes | Required for API key authentication |
| X-AUTH-SIGNATURE | Yes | Required for API key authentication |

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |
| side | string | Yes | Order side (BUY/SELL) |
| type | string | Yes | Order type (LIMIT/MARKET/STOP_LIMIT)|
| price | string | No | Order price |
| quantity | string | No | Order quantity |
| quoteOrderQty | string | No | Quote order quantity |
| stopPrice | string | No | Stop price |
| platform | string | No | Platform |

**Response:**
```json
{
  "data": {
      "orderId": 6016691,
      "price": "5333400",
      "side": "BUY",
      "quantity": "0.0001",
      "status": "OPEN",
      "symbol": "BTC-INR",
      "type": "LIMIT",
      "createdAt": 1744362483471
  },
  "statusCode": 200,
  "statusDescription": "Success"
}
```

### Get Orders
Get orders with optional filtering.

**Endpoint:** `GET /api/v2/ex/orders`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| X-AUTH-APIKEY | Yes | Required for API key authentication |
| X-AUTH-SIGNATURE | Yes | Required for API key authentication |

**Parameters:**
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
          "symbol": "ETH-INR",
          "side": "BUY",
          "type": "LIMIT",
          "origQty": "0.0001",
          "price": "5333400",
          "avgExecutedPrice": "0",
          "openQty": "0.0001",
          "filledQty": "0",
          "cancelledQty": "0",
          "status": "OPEN",
          "origQuoteOrderQty": "0",
          "stopPrice": "0",
          "feeCurrency": "INR",
          "fees": "0",
          "tax": "0",
          "tds": "0",
          "createdAt": 1744284283839,
          "updatedAt": 1744284284207
        }
      ]
    },
    "statusCode": 200,
    "statusDescription": "Success"
}
```

### Get Order Details
Get details of a specific order.

**Endpoint:** `GET /api/v2/ex/orders/{orderId}`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| X-AUTH-APIKEY | Yes | Required for API key authentication |
| X-AUTH-SIGNATURE | Yes | Required for API key authentication |

**Response:**
```json
{
    "data": {
        "orderId": 5784098,
        "symbol": "ETH-INR",
        "side": "SELL",
        "type": "LIMIT",
        "origQty": "0.11",
        "price": "172470.9",
        "avgExecutedPrice": "0",
        "openQty": "0",
        "filledQty": "0",
        "cancelledQty": "0.11",
        "status": "CANCELLED",
        "origQuoteOrderQty": "0",
        "stopPrice": "0",
        "feeCurrency": "INR",
        "fees": "0",
        "tax": "0",
        "tds": "0",
        "createdAt": 1742300104074,
        "updatedAt": 1742302555861
    },
    "statusCode": 200,
    "statusDescription": "Success"
}
```

### Cancel Order
Cancel a specific order.

**Endpoint:** `DELETE /api/v2/ex/orders/{orderId}`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| X-AUTH-APIKEY | Yes | Required for API key authentication |
| X-AUTH-SIGNATURE | Yes | Required for API key authentication |

**Response:**
```json
{
  "data": {
      "orderId": 6016691,
      "symbol": "BTC-INR"
  },
  "statusCode": 200,
  "statusDescription": "Success"
}
```

### Cancel All Orders for a symbol
Cancel all orders for a trading pair.

**Endpoint:** `DELETE /api/v2/ex/orders`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| X-AUTH-APIKEY | Yes | Required for API key authentication |
| X-AUTH-SIGNATURE | Yes | Required for API key authentication |

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair symbol |

**Response:**
```json
{
    "data": null,
    "statusCode": 200,
    "statusDescription": "Success"
}
```


### Cancel All Orders
Cancel all orders

**Endpoint:** `DELETE /api/v2/ex/cancelAll`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| X-AUTH-APIKEY | Yes | Required for API key authentication |
| X-AUTH-SIGNATURE | Yes | Required for API key authentication |


**Response:**
```json
{
    "data": null,
    "statusCode": 200,
    "statusDescription": "Success"
}
```

### Get Order Fills
Get fills for a specific order.

**Endpoint:** `GET /api/v2/ex/orders/fills/{orderId}`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| X-AUTH-APIKEY | Yes | Required for API key authentication |
| X-AUTH-SIGNATURE | Yes | Required for API key authentication |

**Response:**
```json
{
    "data": {
        "orderId": 660529,
        "symbol": "TRX-INR",
        "side": "BUY",
        "type": "LIMIT",
        "origQty": "5.744925",
        "price": "2.611",
        "avgExecutedPrice": "2.610999",
        "openQty": "0",
        "filledQty": "5.744925",
        "cancelledQty": "0",
        "status": "FILLED",
        "origQuoteOrderQty": "0",
        "stopPrice": "0",
        "feeCurrency": "INR",
        "fees": "0.02",
        "tax": "0",
        "tds": "0",
        "createdAt": 1601280571090,
        "updatedAt": 1610362215763,
        "fills": [
            {
                "quantity": "5.744925",
                "price": "2.611",
                "amount": "14.9999",
                "fees": "0.02",
                "intradayFees": "0",
                "tax": "0",
                "tds": "0",
                "totalFees": "0.02",
                "feeCurrency": "INR",
                "createdAt": 1610362215763,
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

**Endpoint:** `GET /api/v2/ex/fee/{symbol}`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | JWT token or API key authentication |
| X-AUTH-APIKEY | Yes | Required for API key authentication |
| X-AUTH-SIGNATURE | Yes | Required for API key authentication |

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| side | string | Yes | Order side (BUY,SELL) |

**Response:**
```json
{
    "data": {
        "symbol": "BTC-INR",
        "takerFeeRate": "0.5",
        "makerFeeRate": "0.45",
        "percentage": true,
        "gst": "18",
        "tds": "0"
    },
    "statusCode": 200,
    "statusDescription": "Success"
}
``` 