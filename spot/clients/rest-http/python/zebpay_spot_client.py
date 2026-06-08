import hashlib
import hmac
import json
import requests
import time
import urllib.parse
from typing import Optional, Dict, Any, List, Union

class ZebpayAPIError(Exception):
    def __init__(self, code: int, message: str):
        self.code = code
        self.message = message
        super().__init__(f"API Error {code}: {message}")

class SpotClient:
    def __init__(self, api_key: Optional[str] = None, api_secret: Optional[str] = None, jwt: Optional[str] = None, base_url: str = "https://sapi.zebpay.com"):
        self.api_key = api_key
        self.api_secret = api_secret
        self.jwt = jwt
        self.base_url = base_url
        self.session = requests.Session()

    def _is_private_endpoint(self, endpoint: str) -> bool:
        # Currencies and exchangeInfo are public endpoints under /api/v2/ex
        if "/api/v2/ex/currencies" in endpoint or "/api/v2/ex/exchangeInfo" in endpoint:
            return False
        return "/api/v2/ex" in endpoint or "/api/v2/account" in endpoint

    def _make_request(self, method: str, endpoint: str, params: Optional[Dict] = None, data: Optional[Dict] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        
        # Clone parameters and data to avoid side-effects
        req_params = params.copy() if params else {}
        req_data = data.copy() if data else None
        
        headers = {
            "Content-Type": "application/json"
        }
        
        if self._is_private_endpoint(endpoint):
            if self.jwt:
                headers["Authorization"] = f"Bearer {self.jwt}"
            elif self.api_key and self.api_secret:
                timestamp = int(time.time() * 1000)
                
                if method in ["GET", "DELETE"]:
                    req_params["timestamp"] = timestamp
                    
                    if method == "GET":
                        query_string = urllib.parse.urlencode(req_params, quote_via=urllib.parse.quote)
                        signature = hmac.new(
                            self.api_secret.encode("utf-8"),
                            query_string.encode("utf-8"),
                            hashlib.sha256
                        ).hexdigest()
                    else:  # DELETE
                        # According to API spec, DELETE signs the request body, but includes timestamp in query params too
                        body_params = req_data if req_data else {}
                        body_params["timestamp"] = timestamp
                        body_string = json.dumps(body_params, separators=(',', ':'))
                        signature = hmac.new(
                            self.api_secret.encode("utf-8"),
                            body_string.encode("utf-8"),
                            hashlib.sha256
                        ).hexdigest()
                        req_data = body_params
                else:  # POST/PUT
                    body_params = req_data if req_data else {}
                    body_params["timestamp"] = timestamp
                    body_string = json.dumps(body_params, separators=(',', ':'))
                    signature = hmac.new(
                        self.api_secret.encode("utf-8"),
                        body_string.encode("utf-8"),
                        hashlib.sha256
                    ).hexdigest()
                    req_data = body_params
                
                headers["x-auth-apikey"] = self.api_key
                headers["x-auth-signature"] = signature
            else:
                raise ValueError("Authentication credentials are required for private endpoints. Provide either a JWT token ('jwt') or both API key and secret ('api_key' & 'api_secret').")

        # Serialize query parameters for GET and DELETE to prevent requests from altering format
        if method in ["GET", "DELETE"] and req_params:
            query_string = urllib.parse.urlencode(req_params, quote_via=urllib.parse.quote)
            url = f"{url}?{query_string}"
            req_params = None
        else:
            if not req_params:
                req_params = None

        try:
            response = self.session.request(method, url, params=req_params, json=req_data, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response is not None and e.response.status_code == 429:
                # Rate limit hit, wait and retry
                time.sleep(1)
                return self._make_request(method, endpoint, params, data)
            
            error_msg = e.response.text if e.response is not None else str(e)
            status_code = e.response.status_code if e.response is not None else 500
            raise ZebpayAPIError(status_code, error_msg)
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
        return self._make_request("GET", "/api/v2/market/klines", params=params)

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
        params = {"symbol": symbol}
        return self._make_request("GET", "/api/v2/market/ticker", params=params)

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

    def get_exchange_fee(self, symbol: str, side: str) -> Dict:
        """Get maker and taker fee rates."""
        params = {"side": side}
        return self._make_request("GET", f"/api/v2/ex/myfee/{symbol}", params=params)

    def get_orders(self, symbol: str, status: Optional[str] = None, current_page: int = 1, page_size: int = 20, start_time: Optional[int] = None, end_time: Optional[int] = None) -> Dict:
        """Get list of orders."""
        params = {
            "symbol": symbol,
            "currentPage": current_page,
            "pageSize": page_size
        }
        if status:
            params["status"] = status
        if start_time is not None:
            params["startTime"] = start_time
        if end_time is not None:
            params["endTime"] = end_time
        return self._make_request("GET", "/api/v2/ex/orders", params=params)

    def place_order(self, symbol: str, side: str, type: str, price: Optional[str] = None,
                   amount: Optional[str] = None, quote_order_amount: Optional[str] = None,
                   stop_loss_price: Optional[str] = None, client_order_id: Optional[str] = None,
                   platform: Optional[str] = None) -> Dict:
        """Place a new order."""
        data = {
            "symbol": symbol,
            "side": side,
            "type": type
        }
        if price:
            data["price"] = price
        if amount:
            data["amount"] = amount
        if quote_order_amount:
            data["quoteOrderAmount"] = quote_order_amount
        if stop_loss_price:
            data["stopLossPrice"] = stop_loss_price
        if client_order_id:
            data["clientOrderId"] = client_order_id
        if platform:
            data["platform"] = platform
            
        return self._make_request("POST", "/api/v2/ex/orders", data=data)

    def cancel_order(self, order_id: Union[str, int]) -> Dict:
        """Cancel a specific order."""
        params = {"orderId": order_id}
        return self._make_request("DELETE", "/api/v2/ex/order", params=params)

    def cancel_all_orders(self, symbol: str) -> Dict:
        """Cancel all orders for a specific trading pair."""
        params = {"symbol": symbol}
        return self._make_request("DELETE", "/api/v2/ex/orders", params=params)

    def cancel_all_orders_all_symbols(self) -> List[Dict]:
        """Cancel all active orders across all symbols."""
        return self._make_request("DELETE", "/api/v2/ex/orders/cancelAll")

    def get_order_details(self, order_id: Union[str, int]) -> Dict:
        """Get details of a specific order."""
        params = {"orderId": order_id}
        return self._make_request("GET", "/api/v2/ex/order", params=params)

    def get_order_fills(self, order_id: Union[str, int]) -> List[Dict]:
        """Get fills for a specific order."""
        params = {"orderId": order_id}
        return self._make_request("GET", "/api/v2/ex/order/fills", params=params)

    def get_trading_pairs(self) -> Dict:
        """Get list of available trading pairs."""
        return self._make_request("GET", "/api/v2/ex/exchangeInfo")

    def get_service_status(self) -> Dict:
        """Get service status."""
        return self._make_request("GET", "/api/v2/system/status")

    def get_server_time(self) -> Dict:
        """Get current server time."""
        return self._make_request("GET", "/api/v2/system/time")