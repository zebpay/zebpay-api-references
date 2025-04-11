# Data Models Guide

This guide describes the data models used in the Zebpay Spot API.

## Table of Contents
- [Common Models](#common-models)
- [Market Data Models](#market-data-models)
- [Account Models](#account-models)
- [Order Models](#order-models)
- [Trade Models](#trade-models)

## Common Models

### Error Response
```typescript
interface ErrorResponse {
  code: number;
  message: string;
}
```

### Pagination
```typescript
interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
```

## Market Data Models

### Ticker
```typescript
interface Ticker {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  high: string;
  low: string;
  volume: string;
  quoteVolume: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
}
```

### Order Book
```typescript
interface OrderBook {
  bids: Array<[string, string]>; // [price, quantity]
  asks: Array<[string, string]>; // [price, quantity]
}
```

### Trade
```typescript
interface Trade {
  id: string;
  price: string;
  quantity: string;
  time: string;
  isBuyerMaker: boolean;
}
```

### Kline
```typescript
interface Kline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  takerBuyBaseVolume: string;
  takerBuyQuoteVolume: string;
}
```

## Account Models

### Balance
```typescript
interface Balance {
  asset: string;
  free: string;
  locked: string;
}
```

### Account
```typescript
interface Account {
  balances: Balance[];
  permissions: string[];
}
```

## Order Models

### Order
```typescript
interface Order {
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT';
  price?: string;
  quantity?: string;
  quoteOrderQty?: string;
  stopPrice?: string;
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED' | 'EXPIRED';
  time: number;
}
```

### Order Response
```typescript
interface OrderResponse extends Order {
  executedQty: string;
  cummulativeQuoteQty: string;
}
```

### Order Fill
```typescript
interface OrderFill {
  price: string;
  qty: string;
  commission: string;
  commissionAsset: string;
  tradeId: string;
}
```

## Trade Models

### Trade History
```typescript
interface TradeHistory {
  symbol: string;
  id: string;
  orderId: string;
  price: string;
  qty: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  isBuyer: boolean;
  isMaker: boolean;
}
```

## Examples

### Ticker Response
```json
{
  "symbol": "BTC-INR",
  "price": "5500000",
  "priceChange": "100000",
  "priceChangePercent": "1.85",
  "high": "5600000",
  "low": "5400000",
  "volume": "10.5",
  "quoteVolume": "57750000",
  "lastPrice": "5500000",
  "bidPrice": "5499000",
  "askPrice": "5501000"
}
```

### Order Book Response
```json
{
  "bids": [
    ["5499000", "0.5"],
    ["5498000", "1.2"]
  ],
  "asks": [
    ["5501000", "0.3"],
    ["5502000", "0.8"]
  ]
}
```

### Order Response
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

### Balance Response
```json
{
  "asset": "BTC",
  "free": "1.5",
  "locked": "0.5"
}
```

### Trade History Response
```json
{
  "symbol": "BTC-INR",
  "id": "789012",
  "orderId": "123456",
  "price": "5500000",
  "qty": "0.001",
  "quoteQty": "5500",
  "commission": "5.5",
  "commissionAsset": "INR",
  "time": 1612345678,
  "isBuyer": true,
  "isMaker": false
}
``` 