# Spot Trading API Reference

This document provides detailed information about the Zebpay Spot Trading API endpoints.

## Base URL

```
https://api.zebpay.com
```

## Market Data APIs (Public)

### Get All Tickers
```
GET /api/v2/market/allTickers
```
Returns the latest ticker information for all trading pairs.

### Get K-line Data
```
GET /api/v2/market/kline
```
Returns historical candlestick data for a specific trading pair.

**Parameters:**
- `symbol` (required): Trading pair symbol
- `interval` (required): Candlestick interval (e.g., 1m, 5m, 15m)
- `startTime` (required): Start time in epoch format
- `endTime` (required): End time in epoch format

### Get Order Book
```
GET /api/v2/market/orderbook
```
Returns the order book depth for a specific trading pair.

**Parameters:**
- `symbol` (required): Trading pair symbol
- `limit` (optional): Number of orders to return (default: 15, max: 100)

### Get Order Book Ticker
```
GET /api/v2/market/orderbook/ticker
```
Returns the best bid and ask prices for a specific trading pair.

**Parameters:**
- `symbol` (required): Trading pair symbol

### Get Ticker for Symbol
```
GET /api/v2/market/ticker/{symbol}
```
Returns the latest ticker information for a specific trading pair.

### Get Recent Trades
```
GET /api/v2/market/trades
```
Returns recent trades for a specific trading pair.

**Parameters:**
- `symbol` (required): Trading pair symbol
- `limit` (optional): Number of trades to return (default: 200)
- `page` (optional): Page number for pagination (default: 1)

## Exchange APIs (Private)

### Get Account Balance
```
GET /api/v2/account/balance
```
Returns the account balance information.

**Parameters:**
- `symbol` (optional): Trading pair symbol
- `currencies` (optional): Comma-separated list of currencies

### Get Coin Settings
```
GET /api/v2/ex/currencies
```
Returns the list of available coins with their configurations.

### Get Exchange Fee
```
GET /api/v2/ex/fee/{code}
```
Returns the maker and taker fee rates for a trading pair.

**Parameters:**
- `code` (required): Trading pair code
- `side` (required): Order side (BUY/SELL)

### Order Management

#### Get Orders
```
GET /api/v2/ex/orders
```
Returns a list of orders.

**Parameters:**
- `symbol` (required): Trading pair symbol
- `status` (optional): Order status
- `currentPage` (optional): Page number
- `pageSize` (optional): Number of records per page

#### Place Order
```
POST /api/v2/ex/orders
```
Places a new order.

**Request Body:**
```json
{
  "symbol": "string",
  "side": "string",
  "type": "string",
  "price": "string",
  "quantity": "string",
  "quoteOrderQty": "string",
  "stopPrice": "string",
  "platform": "string"
}
```

#### Cancel Order
```
DELETE /api/v2/ex/orders/{orderId}
```
Cancels a specific order.

#### Cancel All Orders
```
DELETE /api/v2/ex/orders
```
Cancels all orders for a specific trading pair.

**Parameters:**
- `symbol` (required): Trading pair symbol

#### Get Order Details
```
GET /api/v2/ex/orders/{orderId}
```
Returns details of a specific order.

#### Get Order Fills
```
GET /api/v2/ex/orders/fills/{orderId}
```
Returns the fills (executed trades) for a specific order.

### Get Trading Pairs
```
GET /api/v2/ex/tradepairs
```
Returns the list of available trading pairs.

### Service Status
```
GET /api/v2/status
```
Returns the service status.

### Server Time
```
GET /api/v2/time
```
Returns the current server time. 