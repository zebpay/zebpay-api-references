# API Reference: Private Wallet Endpoints

These endpoints interact with the user's wallet and require **Authentication (JWT or API Key/Secret)**. See the [Authentication Guide](../authentication.md) for details on how to authenticate requests. All successful responses follow the standard [ApiResponse](../data-models.md#apiresponse) structure.

---

### Get Wallet Balance

Retrieves the user's balances for all assets in their wallet.

#### Request

| Attribute       | Value                       |
| :-------------- | :-------------------------- |
| **HTTP Method** | `GET`                       |
| **Endpoint Path**| `/api/v1/wallet/balance` [cite: node/utils/config.js]   |
| **Auth Required**| Yes                         |
| **Query Params** | None                        |
| **Request Body** | N/A                         |

#### Success Response

| Status Code | Description      |
| :---------- | :--------------- |
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** ([WalletBalance](../data-models.md#walletbalance) object):
- A mapping of asset symbols (e.g., "USDT", "BTC") to their respective [AssetBalance](../data-models.md#assetbalance) objects detailing total, free, and used amounts.

##### Example (`data` field content)

```json
{
  "USDT": {
    "total": 10000.50,
    "free": 8500.25,
    "used": 1500.25
  },
  "BTC": {
    "total": 0.5,
    "free": 0.2,
    "used": 0.3
  }
}
```

> See [Error Response Structure](../error-handling.md) for error formats.
