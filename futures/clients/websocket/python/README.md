# ZebPay Futures Private WebSocket Client — Python

This sample client connects to the Socket.IO `/auth-stream` namespace and dispatches every private Futures event to registered Python callbacks.

This is a Socket.IO client over WebSocket transport, not a raw WebSocket or Server-Sent Events client.

**Service URL:** `https://sp-futuresws.zebpay.com`  
**Namespace URL:** `https://sp-futuresws.zebpay.com/auth-stream`

The client uses that host by default. Override it with `base_url` or `WEBSOCKET_BASE_URL`.

## Requirements

- Python 3.9 or newer
- An API key with `fetch:details`, or a supported JWT

For one API key that supports both this private stream and full REST trading, grant that key both `fetch:details` and `futures:trading`. The WebSocket handshake itself checks `fetch:details`.

## Install

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## API Key + HMAC

```python
import os

from client import FuturesPrivateWebSocketClient

client = FuturesPrivateWebSocketClient(
    api_key=os.environ["API_KEY"],
    secret_key=os.environ["SECRET_KEY"],
    subaccount_id=os.getenv("SUBACCOUNT_ID")
)


@client.on("auth.ok")
def authenticated(details):
    print("Authenticated", details)


@client.on("orderFilled")
def order_filled(payload):
    print("orderFilled", payload)


@client.on("auth.error")
def authentication_failed(error):
    print("Authentication failed", error)


client.connect()
client.wait_for_auth()
client.wait()
```

The client generates a new timestamp and HMAC for each explicit `connect()` call.

## JWT

Static JWT:

```python
client = FuturesPrivateWebSocketClient(
    jwt=os.environ["JWT_TOKEN"],
    client_type="api"
)
```

Refreshable JWT:

```python
client = FuturesPrivateWebSocketClient(
    client_type="api",
    token_provider=get_current_jwt
)
```

`token_provider` is a synchronous callable and is invoked for every explicit `connect()` call. The client requires exactly one authentication method; JWT and API-key credentials cannot be configured together.

## Methods

- `connect()` — connect with freshly generated credentials.
- `disconnect()` — close the connection.
- `wait()` — block while the Socket.IO client runs.
- `wait_for_auth(timeout=10)` — wait for `auth.ok`; raises on timeout or `auth.error`.
- `build_auth()` — build the next handshake credentials.
- `on(event, handler)` — register a callback, or use it as a decorator.

## Events

Lifecycle and authentication:

- `connect`
- `auth.ok`
- `auth.error`
- `connect_error`
- `disconnect`
- `handler_error`

Private business events:

- `newOrder`
- `orderFilled`
- `orderPartiallyFilled`
- `orderCancelled`
- `orderFailed`
- `newPosition`
- `updatePosition`
- `closePosition`
- `balanceUpdate`
- `newTrade`
- `autoTopupSuccess`
- `autoTopupFailed`
- `marginCallAlert`
- `liquidationAlert`

`PRIVATE_EVENTS` is exported by the `client` package.

## Run the Complete Example

```bash
cp .env.example .env
# Edit .env, then:
python run_example.py
```

The example supports `AUTH_METHOD=api_key` and `AUTH_METHOD=jwt`.

## Test

```bash
python -m pip install -r requirements-dev.txt
python -m unittest discover -s tests
python -m compileall -q client utils run_example.py tests
```

Tests cover both mocked behavior and a real WebSocket connection to an in-process Socket.IO server. They never contact the live service.

## Connection Failure Notes

- This sample client disables automatic reconnection and does not retry failed connections.
- Connection and authentication failures are surfaced through `connect_error`, `auth.error`, `connect()`, or `wait_for_auth()`.
- If the caller explicitly invokes `connect()` again, fresh HMAC credentials are generated or the configured `token_provider` is called again.
- Reconcile open orders, positions, and balances through REST after `auth.ok`, because private events are live-only and are not replayed.

## Files

```text
.
├── client/
│   ├── __init__.py
│   └── client.py
├── utils/
│   ├── __init__.py
│   └── auth.py
├── tests/
│   ├── test_client.py
│   └── test_transport_integration.py
├── run_example.py
├── .env.example
├── requirements.txt
└── requirements-dev.txt
```

See the [private WebSocket reference](../../../api-reference/websocket/README.md) for the protocol contract.
