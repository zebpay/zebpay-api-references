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

### ApiSuccessResponse
```typescript
interface ApiSuccessResponse<T> {
  data: T;
  statusCode: number;
  statusDescription: string;
}
```

### Paginated
```typescript
interface Paginated<T> {
  currentPage: number;
  pageSize: number;
  totalNum: number;
  totalPage: number;
  items: T[];
}
```

## Market Data Models

### Ticker
```typescript
interface Ticker {
  symbol: string;
  timestamp: number;
  high: string;
  low: string;
  bid: string;
  bidVolume: string;
  ask: string;
  askVolume: string;
  vwap: string;
  open: string;
  close: string;
  last: string;
  previousClose: string;
  change: string;
  percentage: string;
  average: string;
  baseVolume: string;
  quoteVolume: string;
}
```

### Order Book
```typescript
interface OrderBook {
  nonce: number;
  bids: Array<[string, string]>; // [price, quantity]
  asks: Array<[string, string]>; // [price, quantity]
  timestamp: number;
}
```

### Order Book Ticker
```typescript
interface OrderBookTicker {
  symbol: string;
  bidPrice: string;
  bidVolume: string;
  askPrice: string;
  askVolume: string;
}
```

### Trade
```typescript
interface Trade {
  id: number;
  side: 'buy' | 'sell';
  amount: string;
  price: string;
  timestamp: number;
  isBuyerMaker: boolean;
  symbol: string;
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
}
```

## Exchange Info Models

### ExchangeInfo
```typescript
interface ExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: unknown[];
  exchangeFilters: unknown[];
  symbols: ExchangeSymbol[];
}
```

### ExchangeSymbol
```typescript
interface ExchangeSymbol {
  symbol: string;
  status: string; // e.g., "Open"
  baseAsset: string;
  quoteAsset: string;
  pricePrecision: string;
  quantityPrecision: string;
  tickSz: string;
  lotSz: string;
  orderTypes: string[]; // e.g., ["LIMIT", "STOP_LOSS_LIMIT", "MARKET"]
  timeInForce: string[];
  makerFee: number;
  takerFee: number;
}
```

### Currency
```typescript
interface Currency {
  currency: string;
  name: string;
  fullName: string;
  precision: string;
  type: 'crypto' | 'fiat';
  isDebitEnabled: boolean;
  chains: ChainInfo[];
}
```

### ChainInfo
```typescript
interface ChainInfo {
  chainName: string;
  withdrawalMinSize: string;
  depositMinSize: string;
  withdrawalFee: string;
  isWithdrawEnabled: string; // "true" | "false"
  isDepositEnabled: string;  // "true" | "false"
  contractAddress: string;
  withdrawPrecision: string;
  maxWithdraw: string;
  maxDeposit: string;
  needTag: string; // "true" | "false"
  chainId: string;
  AddressRegex: string;
}
```

## Account Models

### BalanceItem
```typescript
interface BalanceItem {
  currency: string;
  total: string;
  free: string;
  used: string;
  usedInExchange: string;
  usedInQt: string;
  usedInLending: string;
  usedInTransfers: string;
  isFiat: boolean;
  cryptoPackBalance: string;
  updatedAt: number;
}
```

### AccountBalancesResponse
```typescript
type AccountBalancesResponse = ApiSuccessResponse<BalanceItem[]>;
```

## Order Models

### Order Types
```typescript
type OrderStatus = 'OPEN' | 'FILLED' | 'CANCELLED' | 'COMPLETED';
type TimeInForce = 'GTC';
type OrderSide = 'BUY' | 'SELL';
type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_LOSS_LIMIT';
```

### OrderSummary
```typescript
interface OrderSummary {
  orderId: number;
  clientOrderId: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  price: string;
  amount: string;
  quoteOrderAmount: string;
  filled: string;
  remaining: string;
  status: OrderStatus;
  timeInForce: TimeInForce;
  timestamp: number;
}
```

### OrderDetail
```typescript
interface OrderDetail extends OrderSummary {
  feeCurrency: string;
  fees: string;
  tax: string;
  tds: string;
  avgExecutedPrice: string;
}
```

### OrderFillItem
```typescript
interface OrderFillItem {
  amount: string;
  price: string;
  cost: string;
  fees: string;
  intradayFees: string;
  tax: string;
  tds: string;
  totalFees: string;
  feeCurrency: string;
  createdAt: number;
  isMaker: boolean;
}
```

### OrderFillsResponse
```typescript
interface OrderFillsResponseData extends OrderDetail {
  fills: OrderFillItem[];
}

type OrderFillsResponse = ApiSuccessResponse<OrderFillsResponseData>;
```

### OrdersListResponse
```typescript
type OrdersListResponse = ApiSuccessResponse<Paginated<OrderDetail>>;
```

### CancelledOrder
```typescript
interface CancelledOrder {
  orderId: number;
  symbol: string;
  status: 'CANCELLED';
}
```

## Trade Models

## Fee Models

### ExchangeFee
```typescript
interface ExchangeFee {
  symbol: string;
  takerFeeRate: string;
  makerFeeRate: string;
  percentage: boolean;
  gst: string;
  tds: string;
}
```

## Examples

### Ticker Response
```json
{
  "data": {
    "symbol": "BTC-INR",
    "timestamp": 1756811917290,
    "high": "10150000",
    "low": "9910110",
    "bid": "9992481.39",
    "bidVolume": "0.00002",
    "ask": "9993095.54",
    "askVolume": "0.00092064",
    "vwap": "0",
    "open": "9973120.745",
    "close": "9992788.465",
    "last": "9992788.465",
    "previousClose": "0",
    "change": "19667.72",
    "percentage": "0.19",
    "average": "9982954.605",
    "baseVolume": "1.21648014",
    "quoteVolume": "12156028.71"
  },
  "statusCode": 200,
  "statusDescription": "Success"
}
```

### Order Book Response
```json
{
  "data": {
    "nonce": 51549652,
    "bids": [["9993095.54", "0.00002"]],
    "asks": [["10148991", "0.00370431"]],
    "timestamp": 1756811787
  },
  "statusCode": 200,
  "statusDescription": "Success"
}
```

### Place Order Response
```json
{
  "data": {
    "orderId": 6016691,
    "clientOrderId": "SKcbGT5MLDNv4sLkrjH9bA",
    "symbol": "BTC-INR",
    "type": "LIMIT",
    "side": "BUY",
    "price": "5333400",
    "amount": "0.0001",
    "quoteOrderAmount": "0",
    "filled": "0",
    "remaining": "0",
    "status": "OPEN",
    "timeInForce": "GTC",
    "timestamp": 1744362483471
  },
  "statusCode": 200,
  "statusDescription": "Success"
}
```

### Balance Response
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
    }
  ],
  "statusCode": 200,
  "statusDescription": "Success"
}
```

### Order Fills Response
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