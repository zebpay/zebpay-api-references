import requests
import time
from typing import Optional, Dict, Any, List, Union

class ZebpayAPIError(Exception):
    def __init__(self, code: int, message: str):
        self.code = code
        self.message = message
        super().__init__(f"API Error {code}: {message}")

class SpotClient:
    def __init__(self, api_key: str, api_secret: str, base_url: str = "https://api.zebpay.com"):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "X-API-KEY": api_key,
            "X-API-SECRET": api_secret
        })

    def _make_request(self, method: str, endpoint: str, params: Optional[Dict] = None, data: Optional[Dict] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        try:
            response = self.session.request(method, url, params=params, json=data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                # Rate limit hit, wait and retry
                time.sleep(1)
                return self._make_request(method, endpoint, params, data)
            raise ZebpayAPIError(e.response.status_code, e.response.text)
        except requests.exceptions.RequestException as e:
            raise ZebpayAPIError(500, str(e))

    # Market Data APIs
    def get_all_tickers(self) -> List[Dict]:
        """Get latest ticker information for all trading pairs."""
        return self._make_request("GET", "/api/v2/market/allTickers")

    def get_kline(self, symbol: str, interval: str, start_time: int, end_time: int) -> List[List]:
        """Get historical candlestick data."""
        params = {
            "symbol": symbol,
            "interval": interval,
            "startTime": start_time,
            "endTime": end_time
        }
        return self._make_request("GET", "/api/v2/market/kline", params=params)

    def get_orderbook(self, symbol: str, limit: int = 15) -> Dict:
        """Get order book depth."""
        params = {
            "symbol": symbol,
            "limit": limit
        }
        return self._make_request("GET", "/api/v2/market/orderbook", params=params)

    def get_orderbook_ticker(self, symbol: str) -> Dict:
        """Get best bid and ask prices."""
        params = {"symbol": symbol}
        return self._make_request("GET", "/api/v2/market/orderbook/ticker", params=params)

    def get_ticker(self, symbol: str) -> Dict:
        """Get ticker information for a specific trading pair."""
        return self._make_request("GET", f"/api/v2/market/ticker/{symbol}")

    def get_recent_trades(self, symbol: str, limit: int = 200, page: int = 1) -> List[Dict]:
        """Get recent trades."""
        params = {
            "symbol": symbol,
            "limit": limit,
            "page": page
        }
        return self._make_request("GET", "/api/v2/market/trades", params=params)

    # Exchange APIs
    def get_account_balance(self, symbol: Optional[str] = None, currencies: Optional[str] = None) -> List[Dict]:
        """Get account balance information."""
        params = {}
        if symbol:
            params["symbol"] = symbol
        if currencies:
            params["currencies"] = currencies
        return self._make_request("GET", "/api/v2/account/balance", params=params)

    def get_coin_settings(self) -> List[Dict]:
        """Get list of available coins with configurations."""
        return self._make_request("GET", "/api/v2/ex/currencies")

    def get_exchange_fee(self, code: str, side: str) -> Dict:
        """Get maker and taker fee rates."""
        params = {"side": side}
        return self._make_request("GET", f"/api/v2/ex/fee/{code}", params=params)

    def get_orders(self, symbol: str, status: Optional[str] = None, current_page: int = 1, page_size: int = 20) -> Dict:
        """Get list of orders."""
        params = {
            "symbol": symbol,
            "currentPage": current_page,
            "pageSize": page_size
        }
        if status:
            params["status"] = status
        return self._make_request("GET", "/api/v2/ex/orders", params=params)

    def place_order(self, symbol: str, side: str, type: str, price: Optional[str] = None,
                   quantity: Optional[str] = None, quote_order_qty: Optional[str] = None,
                   stop_price: Optional[str] = None, platform: Optional[str] = None) -> Dict:
        """Place a new order."""
        data = {
            "symbol": symbol,
            "side": side,
            "type": type
        }
        if price:
            data["price"] = price
        if quantity:
            data["quantity"] = quantity
        if quote_order_qty:
            data["quoteOrderQty"] = quote_order_qty
        if stop_price:
            data["stopPrice"] = stop_price
        if platform:
            data["platform"] = platform
        return self._make_request("POST", "/api/v2/ex/orders", data=data)

    def cancel_order(self, order_id: str) -> Dict:
        """Cancel a specific order."""
        return self._make_request("DELETE", f"/api/v2/ex/orders/{order_id}")

    def cancel_all_orders(self, symbol: str) -> Dict:
        """Cancel all orders for a specific trading pair."""
        params = {"symbol": symbol}
        return self._make_request("DELETE", "/api/v2/ex/orders", params=params)

    def get_order_details(self, order_id: str) -> Dict:
        """Get details of a specific order."""
        return self._make_request("GET", f"/api/v2/ex/orders/{order_id}")

    def get_order_fills(self, order_id: str) -> List[Dict]:
        """Get fills for a specific order."""
        return self._make_request("GET", f"/api/v2/ex/orders/fills/{order_id}")

    def get_trading_pairs(self) -> Dict:
        """Get list of available trading pairs."""
        return self._make_request("GET", "/api/v2/ex/tradepairs")

    def get_service_status(self) -> Dict:
        """Get service status."""
        return self._make_request("GET", "/api/v2/status")

    def get_server_time(self) -> Dict:
        """Get current server time."""
        return self._make_request("GET", "/api/v2/time") 