# Private WebSocket Events

Event names are case-sensitive. Business events are delivered only after `auth.ok` for the effective root account or selected subaccount.

## Order Events

| Event | Meaning |
| :--- | :--- |
| `newOrder` | A new order was accepted by the upstream trading system |
| `orderFilled` | An order was fully filled |
| `orderPartiallyFilled` | An order received a partial fill |
| `orderCancelled` | An order was cancelled |
| `orderFailed` | Order creation or processing failed |

## Position Events

| Event | Meaning |
| :--- | :--- |
| `newPosition` | A position was opened |
| `updatePosition` | An open position changed |
| `closePosition` | A position was closed |
| `autoTopupSuccess` | Automatic margin top-up succeeded |
| `autoTopupFailed` | Automatic margin top-up failed |

## Balance and Trade Events

| Event | Meaning |
| :--- | :--- |
| `balanceUpdate` | A balance changed following a partial or full position close |
| `newTrade` | A new trade execution was reported |

The current upstream behavior does not emit `balanceUpdate` merely because margin is added to a position.

## Risk Events

| Event | Meaning |
| :--- | :--- |
| `marginCallAlert` | The account or position entered a margin-call risk state |
| `liquidationAlert` | A liquidation confirmation or alert was reported |

## Payload Contract

The gateway routes upstream events using the account identifier, then removes these internal routing fields before emitting to the client:

- `accountId`
- `userCategory`

All remaining upstream properties are forwarded. The service source does not define stable public DTOs for these event payloads, so clients should:

- Treat payloads as JSON objects with event-specific fields.
- Ignore unknown fields.
- Avoid requiring undocumented properties.
- Persist identifiers and status fields only after checking that they are present.
- Reconcile important state with the REST API after establishing a new connection.

Example listener:

```javascript
socket.on("orderFilled", (payload) => {
  console.log("orderFilled", payload);
});
```

To inspect all currently delivered events while developing:

```javascript
socket.onAny((event, payload) => {
  console.log(event, payload);
});
```

Do not log credentials or the API secret.

## Delivery Behavior

The private stream is a live notification channel. The gateway does not expose replay, acknowledgement, or cursor controls to clients. A client disconnected during an event may miss it.

After each explicit connection:

1. Wait for `auth.ok`.
2. Fetch current open orders, positions, and balances through REST.
3. Apply subsequent WebSocket events as live updates.
4. Make event handling idempotent where the payload exposes a usable event, order, trade, or position identifier.
