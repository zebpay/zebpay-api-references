# Zebpay Spot Trading Python Client

This is a Python client implementation for the Zebpay Spot Trading API. It is aligned with the official Zebpay API reference.

## Installation

```bash
pip install zebpay-spot-client
```

## Usage

### 1. Public Endpoints (No Credentials Required)
You can instantiate the client without any parameters to query public market data or system information:

```python
from zebpay_spot_client import SpotClient

# Initialize public client
client = SpotClient()

# Public APIs
tickers = client.get_all_tickers()
orderbook = client.get_orderbook(symbol='BTC-USDT', limit=15)
kline_data = client.get_kline(symbol='BTC-USDT', interval='1m', start_time=1700000000000, end_time=1700000086400)
```

### 2. Private Endpoints (Authentication Required)
Private endpoints require authentication credentials. You can authenticate using either API Keys (with local HMAC SHA-256 signing) or a JWT Bearer token.

#### Option A: API Key Authentication
```python
client = SpotClient(api_key='your_api_key', api_secret='your_api_secret')
```

#### Option B: JWT Token Authentication
```python
client = SpotClient(jwt='your_jwt_token')
```

#### Example Actions:
```python
# Private APIs
balance = client.get_account_balance()
orders = client.get_orders(symbol='BTC-USDT', start_time=1700000000000)

# Place a new order
new_order = client.place_order(
    symbol='BTC-USDT',
    side='BUY',
    type='LIMIT',
    price='50000',
    amount='0.001'
)
```

## API Methods

### Market Data APIs
- `get_all_tickers()`
- `get_kline(symbol, interval, start_time, end_time)`
- `get_orderbook(symbol, limit=15)`
- `get_orderbook_ticker(symbol)`
- `get_ticker(symbol)`
- `get_recent_trades(symbol, limit=200, page=1)`

### Exchange APIs
- `get_account_balance(symbol=None, currencies=None)`
- `get_coin_settings()`
- `get_exchange_fee(symbol, side)`
- `get_orders(symbol, status=None, current_page=1, page_size=20, start_time=None, end_time=None)`
- `place_order(symbol, side, type, price=None, amount=None, quote_order_amount=None, stop_loss_price=None, client_order_id=None, platform=None)`
- `cancel_order(order_id)`
- `cancel_all_orders(symbol)`
- `cancel_all_orders_all_symbols()`
- `get_order_details(order_id)`
- `get_order_fills(order_id)`
- `get_trading_pairs()`
- `get_service_status()`
- `get_server_time()`

## Error Handling

The client raises exceptions for API errors:

```python
from zebpay_spot_client import SpotClient, ZebpayAPIError

client = SpotClient()
try:
    tickers = client.get_all_tickers()
except ZebpayAPIError as e:
    print(f"API Error: {e.code} - {e.message}")
```

## Running Unit Tests
You can run the unit tests directly:
```bash
python3 spot/clients/rest-http/python/test_zebpay_spot_client.py
```

## Rate Limiting

The client automatically handles rate limiting (HTTP 429) and will retry requests using exponential backoff when appropriate.