
# API Reference: Public System Endpoints

These endpoints provide system-level public data such as server time and operational status. **Authentication is not required.**

---

### Get System Time

Retrieves the current API server time. Useful for synchronizing clocks or validating timestamps in client applications.

#### Request

| Attribute         | Value              |
|-------------------|--------------------|
| **HTTP Method**   | `GET`              |
| **Endpoint Path** | `/api/v1/system/time` |
| **Auth Required** | No                 |
| **Query Params**  | None               |
| **Request Body**  | N/A                |

#### Success Response

| Status Code | Description        |
|-------------|--------------------|
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** (object):
- **`timestamp`** (`number`): Current server time in Unix timestamp (ms).

##### Example

```json
{
  "timestamp": 1712345678000
}
```

> See [Error Response Structure]((../error-handling.md)) for error formats.

---

### Get System Status

Checks the operational status of the API system.

#### Request

| Attribute         | Value              |
|-------------------|--------------------|
| **HTTP Method**   | `GET`              |
| **Endpoint Path** | `/api/v1/system/status` |
| **Auth Required** | No                 |
| **Query Params**  | None               |
| **Request Body**  | N/A                |

#### Success Response

| Status Code | Description        |
|-------------|--------------------|
| `200 OK`    | Request succeeded. |

The response follows the standard [ApiResponse](../../data-models.md#apiresponse) structure. The `data` field contains:

**`data`** (object):
- **`status`** (`string`): Current system status. Possible values include `"ok"`, `"error"`.

##### Example

```json
{
  "status": "ok"
}
```

> See [Error Response Structure](../../data-models.md#error-response) for error formats.
