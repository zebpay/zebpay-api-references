# Example: Futures Private WebSocket

These examples connect to the `/auth-stream` Socket.IO namespace using API-key HMAC authentication and listen for private account events.

For reusable samples with JWT support and tests, use the [Node.js client](../../clients/websocket/node/README.md) or [Python client](../../clients/websocket/python/README.md).

Before connecting:

- Create an API key with `fetch:details`.
- If the key uses an IP allowlist, add the client machine's public IP.
- Export `API_KEY` and `SECRET_KEY`.
- Optionally export `SUBACCOUNT_ID`.

See [Private WebSocket Authentication](../../api-reference/websocket/authentication.md) for the full contract.

## Node.js

Install:

```bash
npm install socket.io-client
```

Run this example with Node.js 18 or newer:

```javascript
const crypto = require("node:crypto");
const { io } = require("socket.io-client");

const apiKey = process.env.API_KEY;
const secretKey = process.env.SECRET_KEY;
const subaccountId = process.env.SUBACCOUNT_ID?.trim();

if (!apiKey || !secretKey) {
  throw new Error("API_KEY and SECRET_KEY are required");
}

function buildAuth() {
  const timestamp = Date.now();
  const payload = { timestamp };
  if (subaccountId) payload.subaccountId = subaccountId;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(JSON.stringify(payload))
    .digest("hex");

  return {
    clientType: "api",
    apiKey,
    signature,
    timestamp,
    ...(subaccountId ? { subaccountId } : {})
  };
}

const socket = io("https://sp-futuresws.zebpay.com/auth-stream", {
  path: "/socket.io",
  transports: ["websocket"],
  autoConnect: false,
  reconnection: false,
  auth: (callback) => callback(buildAuth())
});

socket.on("connect", () => {
  console.log("Socket.IO connected:", socket.id);
});

socket.on("auth.ok", (details) => {
  console.log("Private stream authenticated:", details);
});

socket.on("auth.error", (error) => {
  console.error("Private stream authentication failed:", error);
});

socket.on("connect_error", (error) => {
  console.error("Connection failed:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.onAny((event, payload) => {
  if (!event.startsWith("auth.")) {
    console.log(event, payload);
  }
});

socket.connect();
```

The `auth` callback creates a fresh timestamp and signature for the explicit connection. This sample does not retry or reconnect automatically.

## Python

Install:

```bash
python -m pip install "python-socketio[client]"
```

This example makes one connection attempt and does not retry:

```python
import hashlib
import hmac
import json
import os
import time

import socketio

BASE_URL = "https://sp-futuresws.zebpay.com"
NAMESPACE = "/auth-stream"

api_key = os.environ["API_KEY"]
secret_key = os.environ["SECRET_KEY"]
subaccount_id = os.getenv("SUBACCOUNT_ID", "").strip()


def build_auth():
    timestamp = int(time.time() * 1000)
    payload = {"timestamp": timestamp}
    if subaccount_id:
        payload["subaccountId"] = subaccount_id

    message = json.dumps(payload, separators=(",", ":"))
    signature = hmac.new(
        secret_key.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()

    auth = {
        "clientType": "api",
        "apiKey": api_key,
        "signature": signature,
        "timestamp": timestamp
    }
    if subaccount_id:
        auth["subaccountId"] = subaccount_id
    return auth


sio = socketio.Client(reconnection=False)
auth_failure = None


@sio.event(namespace=NAMESPACE)
def connect():
    print("Socket.IO connected")


@sio.on("auth.ok", namespace=NAMESPACE)
def auth_ok(details):
    print("Private stream authenticated:", details)


@sio.on("auth.error", namespace=NAMESPACE)
def auth_error(error):
    global auth_failure
    print("Private stream authentication failed:", error)
    auth_failure = f"Authentication failed: {error}"


@sio.event(namespace=NAMESPACE)
def connect_error(error):
    print("Connection failed:", error)


@sio.event(namespace=NAMESPACE)
def disconnect():
    print("Disconnected")


EVENTS = [
    "newOrder", "orderFilled", "orderPartiallyFilled", "orderCancelled",
    "orderFailed", "newPosition", "updatePosition", "closePosition",
    "balanceUpdate", "newTrade", "autoTopupSuccess", "autoTopupFailed",
    "marginCallAlert", "liquidationAlert"
]


def make_handler(event_name):
    def handler(payload):
        print(event_name, payload)
    return handler


for event_name in EVENTS:
    sio.on(event_name, handler=make_handler(event_name), namespace=NAMESPACE)


try:
    sio.connect(
        BASE_URL,
        auth=build_auth(),
        transports=["websocket"],
        socketio_path="socket.io",
        namespaces=[NAMESPACE]
    )
    sio.wait()
except KeyboardInterrupt:
    pass
except socketio.exceptions.ConnectionError as error:
    raise SystemExit(f"Connection failed: {error}") from error
finally:
    if sio.connected:
        sio.disconnect()

if auth_failure:
    raise SystemExit(auth_failure)
```

Connection and authentication failures terminate the sample. After `auth.ok`, reconcile open orders, positions, and balances through REST.
