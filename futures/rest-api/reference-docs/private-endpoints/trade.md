# API Reference: Private Trade Endpoints

These endpoints allow users to manage orders, positions, leverage, and view trade-related history. **Authentication (JWT or API Key/Secret) is required.** See the [Authentication Guide](../authentication.md) for details on how to authenticate requests.

---

### <a id="create-order"> </a> Create Order

Places a new trading order.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `POST`                      |
| **Endpoint Path**| `/api/v1/trade/order`       |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | (object, required) See below |

**Request Body Parameters:**

-   **`symbol`** (`string`, required): Trading symbol (e.g., "BTCUSDT") .
-   **`amount`** (`number`, required): Order quantity in base asset .
-   **`side`** (`string`, required): `"BUY"` or `"SELL"` .
-   **`type`** (`string`, required): `"MARKET"` or `"LIMIT"` .
-   **`marginAsset`** (`string`, required): Asset used for margin (e.g., "USDT") .
-   `price` (`number`, optional): Required if `type` is `"LIMIT"`. Must be positive .
-   `stopLossPrice` (`number`, optional): Trigger price for stop-loss .
-   `takeProfitPrice` (`number`, optional): Trigger price for take-profit .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. | *(Note: Some APIs might return 201 Created)* |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([CreateOrderResponseData](../../data-models.md#createorderresponsedata) object) :
- Details of the created order, typically including fields like `clientOrderId`, `timestamp`, `status`, etc.

##### Example (`data` field content)

```json
{
  "clientOrderId": "myNewOrder123",
  "datetime": "2025-04-05T13:10:00.123Z",
  "timestamp": 1712346600123,
  "symbol": "BTCUSDT",
  "type": "MARKET",
  "timeInForce": "GTC",
  "side": "BUY",
  "price": 0, // Market order price is determined at execution
  "amount": 0.001,
  "filled": 0.001, // Example if filled immediately
  "remaining": 0,
  "reduceOnly": false,
  "postOnly": false,
  "status": "filled" // Example status
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="cancel-order"> Cancel Order

Cancels an existing open order.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `DELETE`                    |
| **Endpoint Path**| `/api/v1/trade/order`       |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | (object, required) See below |

**Request Body Parameters:**

-   **`clientOrderId`** (`string`, required): The client-generated ID of the order to cancel .
-   `symbol` (`string`, optional): Trading symbol .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([CancelOrderResponseData](../../data-models.md#cancelorderresponsedata) object) :
- Details confirming the cancellation attempt.

##### Example (`data` field content)

```json
{
  "clientOrderId": "myLimitOrder456",
  "status": "canceled",
  "symbol": "BTCUSDT",
  "info": {
    "clientOrderId": "myLimitOrder456",
    "orderId": "987654321",
    "status": "CANCELED",
    "success": true
  }
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="cancel-all-orders"> </a> Cancel All Orders

Cancels all open (unfilled) orders for the authenticated user.

#### Request

| Attribute       | Value                         |
| :-------------- | :---------------------------- |
| **HTTP Method** | `DELETE`                      |
| **Endpoint Path**| `/api/v1/trade/order/all`     |
| **Auth Required**| Yes                           |
| **Query Params** | None                          |
| **Request Body** | N/A                           |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** (array of objects) :
- A list of all orders that were successfully canceled. The `data` field will be an empty array `[]` if there were no open orders to cancel.

##### Example (`data` field content)

```json
[
    {
        "clientOrderId": "598d3bda315afed6f07f-370-zeb",
        "status": "canceled",
        "symbol": "BTCUSDT"
    }
]
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="get-order"> Get Order Details

Fetches details of a specific order using its client order ID.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/trade/order`       |
| **Auth Required**| Yes                         |
| **Query Params** | `id` (string, required)     |
| **Request Body** | N/A                         |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([Order](../../data-models.md#order) object) :
- Detailed information about the requested order.

##### Example (`data` field content)

```json
{
  "clientOrderId": "myLimitOrder456",
  "datetime": "2025-04-05T13:05:00.000Z",
  "timestamp": 1712346300000,
  "symbol": "BTCUSDT",
  "type": "LIMIT",
  "timeInForce": "GTC",
  "side": "SELL",
  "price": 66000.00,
  "amount": 0.1,
  "filled": 0,
  "remaining": 0.1,
  "status": "canceled", // Status updated after cancellation
  "reduceOnly": false,
  "postOnly": false
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="edit-order"> </a> Edit Order

Edits an existing open order. This can be used to change the price or amount of a pending order.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `PATCH`                     |
| **Endpoint Path**| `/api/v1/trade/order`       |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | (object, required) See below |

**Request Body Parameters:**

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `clientOrderId` | string | Yes | The unique identifier for the order you wish to edit. |
| `price` | number | No | The new price for the order. |
| `amount` | number | No | The new quantity for the order. |
| `triggerPrice`| number | No | The new trigger price for stop or take-profit orders. |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([EditOrderResponseData](../../data-models.md#editorderresponsedata) object) :
- Details of the edited order.

##### Example (`data` field content)

```json
{
    "clientOrderId": "7a5be049213ad0fb5e17-370-zeb",
    "timeInForce": "GTC",
    "price": 7100000,
    "amount": 0.001,
    "info": {
        "availableBalance": 150.00,
        "status": "Edit request submitted successfully",
        "lockedMargin": 0,
        "lockedMarginInMarginAsset": 0
    }
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="add-tpsl"> Add TP/SL to Position

Adds Take Profit (TP) and/or Stop Loss (SL) orders to an existing position.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `POST`                      |
| **Endpoint Path**| `/api/v1/trade/order/addTPSL`  |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | (object, required) See below |

**Request Body Parameters:**

-   **`positionId`** (`string`, required): Identifier of the position .
-   **`amount`** (`number`, required): Order amount .
-   **`side`** (`string`, required): Order side (`"BUY"` or `"SELL"`) .
-   `symbol` (`string`, optional): Trading symbol .
-   `stopLossPrice` (`number`, optional): Trigger price for stop-loss. At least one of `stopLossPrice` or `takeProfitPrice` is required .
-   `takeProfitPrice` (`number`, optional): Trigger price for take-profit. At least one of `stopLossPrice` or `takeProfitPrice` is required .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([AddTPSLResponseData](../../data-models.md#addtpslresponsedata) object) :
- Details of the created TP/SL order (similar structure to `CreateOrderResponseData`).

##### Example (`data` field content - Take Profit order)

```json
{
  "clientOrderId": "tpOrder789",
  "datetime": "2025-04-05T13:15:00.987Z",
  "timestamp": 1712346900987,
  "symbol": "BTCUSDT",
  "type": "TAKE_PROFIT_MARKET", // Example type
  "timeInForce": "GTC",
  "side": "SELL", // Assuming added to a long position
  "price": 67000.00, // The trigger price
  "amount": 0.05, // Amount to close
  "filled": 0,
  "remaining": 0.05,
  "reduceOnly": true, // TP/SL orders are typically reduce-only
  "postOnly": false,
  "status": "new"
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="add-margin"> Add Margin to Position

Adds margin to an existing isolated margin position.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `POST`                      |
| **Endpoint Path**| `/api/v1/trade/addMargin`    |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | (object, required) See below |

**Request Body Parameters:**

-   **`positionId`** (`string`, required): Identifier of the position .
-   **`amount`** (`number`, required): Amount of margin to add .
-   `symbol` (`string`, optional): Trading symbol .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([MarginResponse](../../data-models.md#marginresponse) object) :
- Details confirming the margin addition and potentially updated balances.

##### Example (`data` field content)

```json
{
  "info": {
    "lockedBalance": 150.50, // Example updated balance
    "withdrawableBalance": 8350.00, // Example updated balance
    "asset": "USDT",
    "message": "Margin added successfully"
  },
  "type": "add",
  "amount": 100.0,
  "code": "USDT",
  "symbol": "BTCUSDT",
  "status": "ok" // Example status
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="reduce-margin"> Reduce Margin from Position

Reduces margin from an existing isolated margin position.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `POST`                      |
| **Endpoint Path**| `/api/v1/trade/reduceMargin` |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | (object, required) See below |

**Request Body Parameters:**

-   **`positionId`** (`string`, required): Identifier of the position .
-   **`amount`** (`number`, required): Amount of margin to reduce .
-   `symbol` (`string`, optional): Trading symbol .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([MarginResponse](../../data-models.md#marginresponse) object) :
- Details confirming the margin reduction and potentially updated balances.

##### Example (`data` field content)

```json
{
  "info": {
    "lockedBalance": 100.50, // Example updated balance
    "withdrawableBalance": 8400.00, // Example updated balance
    "asset": "USDT",
    "message": "Margin reduced successfully"
  },
  "type": "reduce",
  "amount": 50.0,
  "code": "USDT",
  "symbol": "BTCUSDT",
  "status": "ok" // Example status
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="close-position"> Close Position

Closes an existing open position using a market order.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `POST`                      |
| **Endpoint Path**| `/api/v1/trade/position/close`  |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | (object, required) See below |

**Request Body Parameters:**

-   **`positionId`** (`string`, required): Identifier of the position to close .
-   `symbol` (`string`, optional): Trading symbol .

#### Success Response
| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([ClosePositionResponseData](../../data-models.md#closepositionresponsedata) object) :
- Details of the market order created to close the position (similar structure to `CreateOrderResponseData`).

##### Example (`data` field content)

```json
{
  "clientOrderId": "closePosMarket1122",
  "datetime": "2025-04-05T13:20:00.456Z",
  "timestamp": 1712347200456,
  "symbol": "BTCUSDT",
  "type": "MARKET",
  "timeInForce": "IOC", // Often Immediate-Or-Cancel for close orders
  "side": "SELL", // Assuming closing a long position
  "price": 0,
  "amount": 0.05, // Amount closed
  "filled": 0.05,
  "remaining": 0,
  "reduceOnly": true, // Close orders are inherently reduce-only
  "postOnly": false,
  "status": "filled"
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="get-open-orders"> Get Open Orders

Retrieves a list of the user's currently open orders, optionally filtered by symbol.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/trade/order/open-orders` |
| **Auth Required**| Yes                         |
| **Query Params** | See below                   |
| **Request Body** | N/A                         |

**Query Parameters:**

-   **`symbol`** (`string`, required): Trading symbol .
-   `limit` (`number`, optional): Maximum number of orders to return .
-   `since` (`number`, optional): Fetch orders created after this Unix timestamp (ms) .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([OrdersListResponse](../../data-models.md#orderslistresponse) object) :
- A list of open [Order](../../data-models.md#order) objects, potentially with pagination info.

##### Example (`data` field content)

```json
{
  "items": [
    {
      "clientOrderId": "myOpenLimitOrder789",
      "datetime": "2025-04-05T13:18:00.000Z",
      "timestamp": 1712347080000,
      "symbol": "BTCUSDT",
      "type": "LIMIT",
      "timeInForce": "GTC",
      "side": "BUY",
      "price": 64000.00,
      "amount": 0.02,
      "filled": 0,
      "remaining": 0.02,
      "status": "new",
      "reduceOnly": false,
      "postOnly": false
    }
    // ... potentially more open orders
  ],
  "totalCount": 1, // Example count
  "nextTimestamp": null // Example if no more pages
}
```

> See [Error Response Structure](../../error-response.md) for error formats.

---

### <a id="get-open-orders">  Get Positions

Retrieves a list of the user's current positions, optionally filtered by symbols or status.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/trade/positions`    |
| **Auth Required**| Yes                         |
| **Query Params** | See below                   |
| **Request Body** | N/A                         |

**Query Parameters:**

-   `symbols` (`Array<string>`, optional): List of trading symbols to filter by .
-   `status` (`string`, optional): Filter by status (`"OPEN"`, `"CLOSED"`, `"LIQUIDATED"`) .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** (Array<[Position](../../data-models.md#position)> object) :
- A list of the user's positions matching the filters.

##### Example (`data` field content - single open position)

```json
[
  {
    "id": "pos-btc-long-123",
    "symbol": "BTCUSDT",
    "timestamp": 1712347500000,
    "datetime": "2025-04-05T13:25:00.000Z",
    "side": "long", // or "buy"
    "contracts": 0.05,
    "contractSize": 1, // Assuming contract size is 1 BTC
    "entryPrice": 65100.00,
    "notional": 3255.00,
    "leverage": 10,
    "initialMargin": 325.50,
    "liquidationPrice": 59000.00, // Example
    "marginMode": "isolated",
    "status": "OPEN"
  }
]
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### Get User Leverage (Single Symbol)

Retrieves the user's leverage setting for a specific trading symbol.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/trade/userLeverage` |
| **Auth Required**| Yes                         |
| **Query Params** | `symbol` (string, required)  |
| **Request Body** | N/A                         |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([Leverage](../../data-models.md#leverage) object) :
- Leverage settings for the specified symbol.

##### Example (`data` field content)

```json
{
  "symbol": "BTCUSDT",
  "marginMode": "isolated",
  "longLeverage": 10,
  "shortLeverage": 10,
  "info": {
    "contractName": "BTCUSDT",
    "leverage": 10,
    "openPositionCount": 1
  }
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="get-user-leverages"> Get All User Leverages

Retrieves the user's leverage settings for all symbols.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/trade/userLeverages` |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | N/A                         |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** (Array<[Leverage](../../data-models.md#leverage)> object) :
- A list of leverage settings for all symbols configured by the user.

##### Example (`data` field content - excerpt)

```json
[
  {
    "symbol": "BTCUSDT",
    "marginMode": "isolated",
    "longLeverage": 10,
    "shortLeverage": 10,
    "info": { /* ... */ }
  },
  {
    "symbol": "ETHUSDT",
    "marginMode": "isolated",
    "longLeverage": 20,
    "shortLeverage": 20,
    "info": { /* ... */ }
  }
]
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="update-user-leverages"> Update User Leverage

Updates the user's leverage setting for a specific symbol.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `POST`                      |
| **Endpoint Path**| `/api/v1/trade/update/userLeverage` |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | (object, required) See below |

**Request Body Parameters:**

-   **`symbol`** (`string`, required): Trading symbol .
-   **`leverage`** (`number`, required): The new desired leverage value .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([Leverage](../../data-models.md#leverage) object) :
- The updated leverage settings for the symbol.

##### Example (`data` field content)

```json
{
  "symbol": "BTCUSDT",
  "marginMode": "isolated",
  "longLeverage": 25, // Newly updated value
  "shortLeverage": 25, // Newly updated value
  "info": {
    "contractName": "BTCUSDT",
    "updatedLeverage": 25, // Field name might vary in actual response
    "openPositionCount": 1
  }
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="get-order-history"> Get Order History

Retrieves the user's historical orders with pagination.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/trade/order/history`  |
| **Auth Required**| Yes                         |
| **Query Params** | See below                   |
| **Request Body** | N/A                         |

**Query Parameters:**

-   `pageSize` (`number`, optional): Number of orders per page .
-   `timestamp` (`number`, optional): Fetch orders created before this Unix timestamp (ms) .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([OrdersListResponse](../../data-models.md#orderslistresponse) object) :
- A list of historical [Order](../../data-models.md#order) objects, potentially with pagination info.

##### Example (`data` field content)

```json
{
  "items": [
    {
      "clientOrderId": "myMarketOrder111",
      "datetime": "2025-04-04T10:00:00.000Z",
      "timestamp": 1712240400000,
      "symbol": "BTCUSDT",
      "type": "MARKET",
      // ... other order fields ...
      "status": "filled"
    },
     {
      "clientOrderId": "myLimitOrder222",
      "datetime": "2025-04-04T11:00:00.000Z",
      "timestamp": 1712244000000,
      "symbol": "ETHUSDT",
      "type": "LIMIT",
      // ... other order fields ...
      "status": "canceled"
    }
  ],
  "totalCount": 50, // Example total
  "nextTimestamp": 1712240399999 // Example pagination cursor
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="get-trade-history"> Get Trade History

Retrieves the user's historical trades with pagination.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/trade/history`      |
| **Auth Required**| Yes                         |
| **Query Params** | See below                   |
| **Request Body** | N/A                         |

**Query Parameters:**

-   `pageSize` (`number`, optional): Number of trades per page .
-   `timestamp` (`number`, optional): Fetch trades executed before this Unix timestamp (ms) .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([TradesListResponse](../../data-models.md#tradeslistresponse) object) :
- A list of historical [Trade](../../data-models.md#trade) objects, potentially with pagination info.

##### Example (`data` field content)

```json
{
  "items": [
    {
      "id": "trade123",
      "timestamp": 1712240400500,
      "datetime": "2025-04-04T10:00:00.500Z",
      "symbol": "BTCUSDT",
      "order": "orderLink111",
      "type": "market",
      "side": "buy",
      "takerOrMaker": "taker",
      "price": 65050.00,
      "amount": 0.01,
      "cost": 650.50,
      "fee": { "cost": 0.6505, "currency": "USDT" },
      "info": { /* ... raw exchange data ... */ }
    }
    // ... other trades
  ],
  "totalCount": 120, // Example total
  "nextTimestamp": 1712240400499 // Example pagination cursor
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---

### <a id="get-txn-history"> Get Transaction History

Retrieves the user's historical wallet transactions (fees, funding, etc.) with pagination.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/trade/transaction/history`  |
| **Auth Required**| Yes                         |
| **Query Params** | See below                   |
| **Request Body** | N/A                         |

**Query Parameters:**

-   `pageSize` (`number`, optional): Number of transactions per page .
-   `timestamp` (`number`, optional): Fetch transactions before this Unix timestamp (ms) .

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([TransactionsListResponse](../../data-models.md#transactionslistresponse) object) :
- A list of historical [Transaction](../../data-models.md#transaction) objects, potentially with pagination info.

##### Example (`data` field content)

```json
{
  "items": [
    {
      "txid": "txn-fee-abc",
      "timestamp": 1712154000000,
      "datetime": "2025-04-03T12:00:00.000Z",
      "type": "COMMISSION",
      "amount": -0.6505,
      "currency": "USDT",
      "status": "completed",
      "fee": {}, // Fee might be implicit in amount for type=COMMISSION
      "info": { /* ... raw exchange data ... */ }
    },
    {
      "txid": "txn-funding-def",
      "timestamp": 1712067600000,
      "datetime": "2025-04-02T12:00:00.000Z",
      "type": "FUNDING_FEE",
      "amount": -1.2345,
      "currency": "USDT",
      "status": "completed",
      "fee": {},
      "info": { /* ... raw exchange data ... */ }
    }
  ],
  "totalCount": 35, // Example total
  "nextTimestamp": 1712067599999 // Example pagination cursor
}
```

> See [Error Response Structure](../error-handling.md) for error formats.

---
```
