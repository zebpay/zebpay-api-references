"""
Configuration settings for the Zebpay futures API client.
"""
# Base URL for API requests
BASE_URL = 'https://futuresbe.zebpay.com'

# API endpoints
ENDPOINTS = {
    # Public endpoints (no authentication required)
    'public': {
        'market': {
            'markets': '/api/v1/market/markets',
            'order_book': '/api/v1/market/orderBook',
            'ticker_24hr': '/api/v1/market/ticker24Hr',
            'market_info': '/api/v1/market/marketInfo',
            'agg_trade': '/api/v1/market/aggTrade',
            'klines': '/api/v1/market/klines'
        },
        'system': {
            'time': '/api/v1/system/time',
            'status': '/api/v1/system/status'
        },
        'exchange': {
            'tradefee': '/api/v1/exchange/tradefee',
            'tradefees': '/api/v1/exchange/tradefees',
            'exchange_info': '/api/v1/exchange/exchangeInfo',
            'pairs': '/api/v1/exchange/pairs'
        }
    },

    # Private endpoints (authentication required)
    'private': {
        'wallet': {
            'balance': '/api/v1/wallet/balance'
        },
        'trade': {
            'order': '/api/v1/trade/order',
            'order_all': '/api/v1/trade/order/all',
            'add_tpsl': '/api/v1/trade/order/addTPSL',
            'add_margin': '/api/v1/trade/addMargin',
            'reduce_margin': '/api/v1/trade/reduceMargin',
            'close_position': '/api/v1/trade/position/close',
            'open_orders': '/api/v1/trade/order/open-orders',
            'positions': '/api/v1/trade/positions',
            'user_leverage': '/api/v1/trade/userLeverage',
            'user_leverages': '/api/v1/trade/userLeverages',
            'update_leverage': '/api/v1/trade/update/userLeverage',
            'order_history': '/api/v1/trade/order/history',
            'trade_history': '/api/v1/trade/history',
            'transaction_history': '/api/v1/trade/transaction/history'
        }
    }
}
