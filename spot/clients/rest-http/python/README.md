# Zebpay Spot Trading Python Client

This is a Python client implementation for the Zebpay Spot Trading API.

## Installation

```bash
pip install zebpay-spot-client
```

## Usage

```python
from zebpay_spot_client import SpotClient

# Initialize client
client = SpotClient(api_key='your_api_key', api_secret='your_api_secret')

# Public APIs
tickers = client.get_all_tickers()
kline_data = client.get_kline(symbol='BTC-USDT', interval='1m', start_time=1234567890, end_time=1234567899)
orderbook = client.get_orderbook(symbol='BTC-USDT', limit=15)
trades = client.get_recent_trades(symbol='BTC-USDT', limit=200)

# Private APIs
balance = client.get_account_balance()
orders = client.get_orders(symbol='BTC-USDT')
new_order = client.place_order(
    symbol='BTC-USDT',
    side='BUY',
    type='LIMIT',
    price='50000',
    quantity='0.001'
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
- `get_exchange_fee(code, side)`
- `get_orders(symbol, status=None, current_page=1, page_size=20)`
- `place_order(symbol, side, type, price=None, quantity=None, quote_order_qty=None, stop_price=None, platform=None)`
- `cancel_order(order_id)`
- `cancel_all_orders(symbol)`
- `get_order_details(order_id)`
- `get_order_fills(order_id)`
- `get_trading_pairs()`
- `get_service_status()`
- `get_server_time()`

## Error Handling

The client raises exceptions for API errors:

```python
try:
    balance = client.get_account_balance()
except ZebpayAPIError as e:
    print(f"API Error: {e.code} - {e.message}")
```

## Rate Limiting

The client automatically handles rate limiting and will retry requests when appropriate. 