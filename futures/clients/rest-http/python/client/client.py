"""
    Zebpay Futures API Client
    A Python client for interacting with the Zebpay futures API
"""

from typing import Any, Dict, List, Optional
import requests
import json

from ..utils import config
from ..utils.auth import AuthUtils
from ..utils.types import (
    ApiResponse,
    MarketsData,
    OrderBook,
    Ticker,
    AggregateTrade,
    WalletBalance,
    Order,
    CreateOrderResponseData,
    CancelOrderResponseData,
    AddTPSLResponseData,
    MarginResponse,
    Position,
    Leverage,
    ExchangeInfo,
    PairsInfo,
    OrdersListResponse,
    TradesListResponse,
    TransactionsListResponse,
)

class FuturesApiClient:
    def __init__(
        self,
        jwt: Optional[str] = None,
        api_key: Optional[str] = None,
        secret_key: Optional[str] = None,
        timeout: int = 30,
        base_url: str = config.BASE_URL
    ) -> None:
        """
        Initialize the Futures API Client with authentication and configuration details.

        This client supports both JWT-based and API key/secret based authentication.
        You must provide either a valid JWT token, or both API key and secret key.

        Args:
            jwt (Optional[str]): JWT authentication token.
            api_key (Optional[str]): API key for authentication.
            secret_key (Optional[str]): Secret key for API key authentication.
            timeout (int): Request timeout in seconds (default is 30 seconds).
            base_url (str): Base URL for the API (default is configured in utils.config).

        Raises:
            ValueError: If authentication credentials are missing.

        Example:
            # Using JWT authentication:
            client = FuturesApiClient(jwt="your_jwt_token")

            # Using API key authentication:
            client = FuturesApiClient(api_key="your_api_key", secret_key="your_secret_key", timeout=20)
        """
        # Validate that at least one valid authentication method is provided.
        if not jwt and (not api_key or not secret_key):
            raise ValueError(
                'Authentication credentials are required. Provide either a JWT token or an API key and secret key.'
            )
        self.jwt = jwt
        self.api_key = api_key
        self.secret_key = secret_key
        self.timeout_seconds = timeout
        self.base_url = base_url

        # Create a persistent HTTP session for efficient connection reuse.
        self.http_session = requests.Session()
        self.http_session.headers.update({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })

    def _get_headers(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, str]:
        """
        Prepare and return HTTP headers required for an API request based on the endpoint's security requirements.

        This method determines if the requested endpoint is private (requires authentication)
        and then generates the necessary headers. For public endpoints, an empty dictionary is returned.

        Args:
            method (str): HTTP method (e.g., 'GET', 'POST').
            endpoint (str): API endpoint path.
            params (Optional[Dict[str, Any]]): Query parameters for the request.
            data (Optional[Dict[str, Any]]): Request body data for non-GET requests.

        Returns:
            Dict[str, str]: A dictionary of HTTP headers for the API request.

        Raises:
            ValueError: If private endpoint authentication credentials are missing.
        """
        # Check if the endpoint requires authentication.
        is_private = AuthUtils.is_private_endpoint(endpoint)
        if not is_private:
            # Public endpoint: no authentication needed.
            return {}

        if self.jwt:
            # Use JWT token to generate authentication headers.
            return AuthUtils.get_jwt_auth_headers(self.jwt)
        elif self.api_key and self.secret_key:
            if method.upper() == 'GET':
                # For GET requests, include query parameters in the authentication signature.
                return AuthUtils.get_api_key_auth_headers_for_get_req(self.api_key, self.secret_key, params)
            else:
                # For non-GET requests, include the JSON body in the signature.
                headers = AuthUtils.get_api_key_auth_headers_for_non_get_req(self.api_key, self.secret_key, data)
                # Ensure the Content-Type is set.
                if 'Content-Type' not in headers:
                    headers['Content-Type'] = 'application/json'
                return headers
        else:
            raise ValueError("Missing authentication credentials for private endpoint.")

    def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None
    ) -> Any:
        """
        Execute an HTTP request to the API and return the parsed JSON response.

        This is a generic method that handles request construction, error checking,
        and JSON response parsing for all API endpoints.

        Args:
            method (str): HTTP method ('GET', 'POST', 'DELETE', etc.).
            endpoint (str): API endpoint path.
            params (Optional[Dict[str, Any]]): Query parameters to append to the URL.
            data (Optional[Dict[str, Any]]): JSON-serializable request body for non-GET requests.

        Returns:
            Any: Parsed JSON response from the API.

        Raises:
            TimeoutError: If the request exceeds the specified timeout duration.
            ConnectionError: For network or HTTP errors with additional error context.

        Example:
            response = client._request("GET", "/public/system/time")
        """
        # Remove keys with None values from params and data to avoid sending unwanted fields.
        cleaned_params = {k: v for k, v in params.items() if v is not None} if params else None
        cleaned_data = {k: v for k, v in data.items() if v is not None} if data else None

        # Retrieve necessary headers for the request.
        headers = self._get_headers(method, endpoint, cleaned_params, cleaned_data)
        url = f"{self.base_url}{endpoint}"  # Build the complete URL.

        try:
            # Send the HTTP request using the session.
            response = self.http_session.request(
                method=method,
                url=url,
                params=cleaned_params,
                json=cleaned_data,
                headers=headers,
                timeout=self.timeout_seconds
            )
            # Raise an exception for HTTP error statuses.
            response.raise_for_status()
            return response.json()  # Return the parsed JSON response.
        except requests.exceptions.Timeout as e:
            raise TimeoutError(f"Request timed out after {self.timeout_seconds} seconds: {url}") from e
        except requests.exceptions.RequestException as e:
            error_detail = ""
            if e.response is not None:
                try:
                    error_detail = e.response.json()
                except json.JSONDecodeError:
                    error_detail = e.response.text
            raise ConnectionError(f"API Request Error: {e}. URL: {url}. Detail: {error_detail}") from e

    @staticmethod
    def _normalize_string(value: Optional[str]) -> Optional[str]:
        """
        Convert a string to uppercase, if provided.

        Args:
            value (Optional[str]): Input string to normalize.

        Returns:
            Optional[str]: Uppercase version of the input string, or None if not provided.

        Example:
            normalized = FuturesApiClient._normalize_string("btcusdt")  # Returns "BTCUSDT"
        """
        return value.upper() if isinstance(value, str) else value

    # ------------------- MARKET DATA ENDPOINTS (PUBLIC) -------------------
    def fetch_markets(self) -> ApiResponse[MarketsData]:
        """
        Retrieve information about all available trading symbols and exchange metadata. [cite: User-provided Fetch Market Response]

        Returns:
            ApiResponse[MarketsData]: An object containing server time, rate limits,
                                      and a list of MarketSymbol objects. [cite: futures/clients/rest-http/python/utils/types.py]

        Example:
            markets_response = client.fetch_markets()
            if markets_response.get("statusCode") == 200:
                symbols_list = markets_response.get("data", {}).get("symbols")
                print(f"Found {len(symbols_list)} symbols.")
        """
        # The endpoint path is sourced from the config file
        endpoint = config.get_endpoint(['public', 'market', 'markets']) # [cite: futures/clients/rest-http/python/utils/config.py]
        return self._request('GET', endpoint)

    def get_order_book(self, symbol: str) -> ApiResponse[OrderBook]:
        """
        Retrieve the order book for a specified trading pair.

        Args:
            symbol (str): Trading symbol (e.g., 'BTCUSDT').

        Returns:
            ApiResponse[OrderBook]: Order book data including lists of bids and asks.

        Raises:
            ValueError: If the symbol is not provided.

        Example:
            order_book = client.get_order_book("BTCUSDT")
        """
        if not symbol:
            raise ValueError('Symbol is required')
        symbol = self._normalize_string(symbol)
        endpoint = config.get_endpoint(['public', 'market', 'order_book'])
        return self._request('GET', endpoint, params={'symbol': symbol})

    def get_ticker_24hr(self, symbol: str) -> ApiResponse[Ticker]:
        """
        Retrieve 24-hour ticker statistics for a trading pair.

        Args:
            symbol (str): Trading symbol (e.g., 'BTCUSDT').

        Returns:
            ApiResponse[Ticker]: Ticker data including price changes, highs, and lows.

        Raises:
            ValueError: If the symbol is not provided.

        Example:
            ticker_info = client.get_ticker_24hr("BTCUSDT")
        """
        if not symbol:
            raise ValueError('Symbol is required')
        symbol = self._normalize_string(symbol)
        endpoint = config.get_endpoint(['public', 'market', 'ticker_24hr'])
        return self._request('GET', endpoint, params={'symbol': symbol})

    def get_market_info(self) -> ApiResponse[Any]:
        """
        Retrieve general market information.

        Returns:
            ApiResponse[Any]: Data regarding market statistics and available configurations.

        Example:
            market_info = client.get_market_info()
        """
        endpoint = config.get_endpoint(['public', 'market', 'market_info'])
        return self._request('GET', endpoint)

    def get_agg_trade(self, symbol: str) -> ApiResponse[List[AggregateTrade]]:
        """
        Retrieve a list of recent aggregate trades for a given symbol.

        Args:
            symbol (str): Trading symbol (e.g., 'BTCINR').

        Returns:
            ApiResponse[List[AggregateTrade]]: List of aggregated trade data.

        Raises:
            ValueError: If the symbol is not provided.

        Example:
            agg_trades = client.get_agg_trade("BTCINR")
        """
        if not symbol:
            raise ValueError('Symbol is required')
        symbol = self._normalize_string(symbol)
        endpoint = config.get_endpoint(['public', 'market', 'agg_trade'])
        return self._request('GET', endpoint, params={'symbol': symbol})

    def get_klines(self, kline_params: Dict[str, Any]) -> ApiResponse[List[List[Any]]]:
        """
        Retrieve historical candlestick data (K-lines) for a specific trading symbol and interval.

        Args:
            kline_params (Dict[str, Any]): Dictionary containing k-line parameters.
                Must include:
                  - symbol: Trading symbol (e.g., 'BTCINR').
                  - interval: Candlestick interval (e.g., '1m', '5m', '1h').
                Optionally include:
                  - startTime: Start time in milliseconds.
                  - endTime: End time in milliseconds.
                  - limit: Maximum number of data points to return.

        Returns:
            ApiResponse[List[List[Any]]]: A list of K-line data points.

        Raises:
            ValueError: If required parameters are missing.

        Example:
            klines = client.get_klines({
                "symbol": "BTCINR",
                "interval": "1h",
                "limit": 100
            })
        """
        required_keys = ['symbol', 'interval']
        if not all(key in kline_params for key in required_keys):
            raise ValueError(f"Required k-line parameters missing. Needed: {required_keys}")
        kline_params['symbol'] = self._normalize_string(kline_params['symbol'])
        endpoint = config.get_endpoint(['public', 'market', 'klines'])
        return self._request('POST', endpoint, data=kline_params)

    # ------------------- SYSTEM ENDPOINTS (PUBLIC) -------------------
    def get_system_time(self) -> ApiResponse[Dict[str, Any]]:
        """
        Retrieve the current system time from the API.

        Returns:
            ApiResponse[Dict[str, Any]]: System time in milliseconds.

        Example:
            system_time = client.get_system_time()
        """
        endpoint = config.get_endpoint(['public', 'system', 'time'])
        return self._request('GET', endpoint)

    def get_system_status(self) -> ApiResponse[Dict[str, Any]]:
        """
        Retrieve the current system status.

        Returns:
            ApiResponse[Dict[str, Any]]: Status of the API system (e.g., "ok" or error details).

        Example:
            status = client.get_system_status()
        """
        endpoint = config.get_endpoint(['public', 'system', 'status'])
        return self._request('GET', endpoint)

    # ------------------- EXCHANGE ENDPOINTS (PUBLIC) -------------------
    def get_trade_fee(self, symbol: str) -> ApiResponse[Dict[str, Any]]:
        """
        Retrieve trading fee details for a specified trading pair.

        Args:
            symbol (str): Trading symbol (e.g., 'BTCUSDT').

        Returns:
            ApiResponse[Dict[str, Any]]: Fee details including maker and taker fees.

        Raises:
            ValueError: If the symbol is not provided.

        Example:
            fee_info = client.get_trade_fee("BTCUSDT")
        """
        if not symbol:
            raise ValueError('Symbol is required')
        symbol = self._normalize_string(symbol)
        endpoint = config.get_endpoint(['public', 'exchange', 'trade_fee'])
        return self._request('GET', endpoint, params={'symbol': symbol})

    def get_trade_fees(self) -> ApiResponse[List[Dict[str, Any]]]:
        """
        Retrieve trading fee details for all supported trading pairs.

        Returns:
            ApiResponse[List[Dict[str, Any]]]: List of fee details for each trading pair.

        Example:
            fees = client.get_trade_fees()
        """
        endpoint = config.get_endpoint(['public', 'exchange', 'trade_fees'])
        return self._request('GET', endpoint)

    def get_exchange_info(self) -> ApiResponse[ExchangeInfo]:
        """
        Retrieve detailed exchange configuration information.

        Returns:
            ApiResponse[ExchangeInfo]: Data including available trading pairs, fee structures, and configurations.

        Example:
            exchange_info = client.get_exchange_info()
        """
        endpoint = config.get_endpoint(['public', 'exchange', 'exchange_info'])
        return self._request('GET', endpoint)

    def get_pairs(self) -> ApiResponse[PairsInfo]:
        """
        Retrieve information about all trading pairs available on the exchange.

        Returns:
            ApiResponse[PairsInfo]: Details for each trading pair including symbols and status.

        Example:
            pairs_info = client.get_pairs()
        """
        endpoint = config.get_endpoint(['public', 'exchange', 'pairs'])
        return self._request('GET', endpoint)

    # ------------------- WALLET ENDPOINTS (PRIVATE) -------------------
    def get_balance(self) -> ApiResponse[WalletBalance]:
        """
        Retrieve the user's wallet balance details.

        Returns:
            ApiResponse[WalletBalance]: Wallet balance information including available funds and margins.

        Example:
            balance = client.get_balance()
        """
        endpoint = config.get_endpoint(['private', 'wallet', 'balance'])
        return self._request('GET', endpoint)

    # ------------------- TRADE ENDPOINTS (PRIVATE) -------------------
    def create_order(self, order_params: Dict[str, Any]) -> ApiResponse[CreateOrderResponseData]:
        """
        Create a new order with the specified parameters.

        This method submits a new order to the API. Order parameters must include:
          - symbol: Trading symbol (e.g., 'BTCUSDT'); normalized to uppercase.
          - amount: Quantity to trade.
          - side: 'BUY' or 'SELL'; normalized to uppercase.
          - type: Order type ('MARKET' or 'LIMIT'); normalized to uppercase.
          - marginAsset: Asset for margin; normalized to uppercase.
          - price: Required for LIMIT orders and must be positive.
          - Optionally: stopLossPrice and/or takeProfitPrice for risk management.

        Args:
            order_params (Dict[str, Any]): Dictionary containing order parameters.

        Returns:
            ApiResponse[CreateOrderResponseData]: Details of the created order.

        Raises:
            ValueError: If required parameters are missing or invalid.

        Example:
            order_details = client.create_order({
                "symbol": "BTCUSDT",
                "amount": 0.5,
                "side": "BUY",
                "type": "LIMIT",
                "marginAsset": "USDT",
                "price": 30000
            })
        """
        required_keys = ['symbol', 'amount', 'side', 'type', 'marginAsset']
        if not all(key in order_params for key in required_keys):
            raise ValueError(f"Required order parameters missing. Needed: {required_keys}")
        # Normalize string parameters to uppercase.
        order_params['symbol'] = self._normalize_string(order_params['symbol'])
        order_params['side'] = self._normalize_string(order_params['side'])
        order_params['type'] = self._normalize_string(order_params['type'])
        order_params['marginAsset'] = self._normalize_string(order_params['marginAsset'])
        if order_params['type'] == 'LIMIT' and 'price' not in order_params:
            raise ValueError('Price is required for LIMIT orders')
        if order_params.get('price') is not None and order_params['price'] <= 0:
            raise ValueError('Price must be positive for LIMIT orders')
        endpoint = config.get_endpoint(['private', 'trade', 'order'])
        return self._request('POST', endpoint, data=order_params)

    def cancel_order(self, cancel_params: Dict[str, Any]) -> ApiResponse[CancelOrderResponseData]:
        """
        Cancel an existing order based on the provided parameters.

        Args:
            cancel_params (Dict[str, Any]): Dictionary containing cancellation parameters.
                Must include:
                  - clientOrderId: Unique identifier for the order.
                  - Optionally, symbol: Trading symbol (will be normalized if provided).

        Returns:
            ApiResponse[CancelOrderResponseData]: Details of the cancelled order.

        Raises:
            ValueError: If clientOrderId is missing.

        Example:
            cancel_response = client.cancel_order({
                "clientOrderId": "order123",
                "symbol": "BTCUSDT"
            })
        """
        if 'clientOrderId' not in cancel_params:
            raise ValueError('Client order ID (clientOrderId) is required')
        if 'symbol' in cancel_params:
            cancel_params['symbol'] = self._normalize_string(cancel_params['symbol'])
        endpoint = config.get_endpoint(['private', 'trade', 'order'])
        return self._request('DELETE', endpoint, data=cancel_params)

    def edit_order(self, order_params: Dict[str, Any]) -> ApiResponse[Any]:
        """
        Edit an existing open order.

        Args:
            order_params (Dict[str, Any]): Dictionary containing the edit parameters.
                Must include:
                  - clientOrderId: The unique identifier for the order to edit.
                Optionally include:
                  - price: The new price for the order.
                  - amount: The new quantity for the order.
                  - triggerPrice: The new trigger price for stop or take-profit orders.

        Returns:
            ApiResponse[Any]: Confirmation of the edit request.

        Raises:
            ValueError: If clientOrderId is missing.

        Example:
            edit_response = client.edit_order({
                "clientOrderId": "7a5be049213ad0fb5e17-370-zeb",
                "price": 7100000,
                "amount": 0.001
            })
        """
        if 'clientOrderId' not in order_params:
            raise ValueError('Client order ID (clientOrderId) is required')
        endpoint = config.get_endpoint(['private', 'trade', 'order'])
        return self._request('PATCH', endpoint, data=order_params)

    def cancel_all_orders(self) -> ApiResponse[List[CancelOrderResponseData]]:
        """
        Cancel all open (unfilled) orders for the authenticated user.

        Returns:
            ApiResponse[List[CancelOrderResponseData]]: A list of all orders that were successfully canceled.

        Example:
            cancel_response = client.cancel_all_orders()
        """
        endpoint = config.get_endpoint(['private', 'trade', 'order_all'])
        return self._request('DELETE', endpoint)

    def get_order(self, client_order_id: str) -> ApiResponse[Order]:
        """
        Retrieve details for a specific order using its client order ID.

        Args:
            client_order_id (str): Unique client order identifier.

        Returns:
            ApiResponse[Order]: Detailed information about the order.

        Raises:
            ValueError: If client_order_id is not provided.

        Example:
            order_details = client.get_order("order123")
        """
        if not client_order_id:
            raise ValueError('Client Order ID is required')
        endpoint = config.get_endpoint(['private', 'trade', 'order'])
        return self._request('GET', endpoint, params={'id': client_order_id})

    def add_tpsl_order(self, tpsl_params: Dict[str, Any]) -> ApiResponse[AddTPSLResponseData]:
        """
        Add take-profit and/or stop-loss orders to an existing position.

        These orders help secure profits or limit losses by automatically triggering at specified price levels.

        Args:
            tpsl_params (Dict[str, Any]): Dictionary containing TP/SL parameters.
                Must include:
                  - positionId: Identifier of the position.
                  - amount: Trade amount.
                  - side: 'BUY' or 'SELL'; normalized to uppercase.
                Optionally include:
                  - symbol: Trading symbol (will be normalized if provided).
                  - stopLossPrice and/or takeProfitPrice (at least one is required).

        Returns:
            ApiResponse[AddTPSLResponseData]: Details of the created TP/SL order.

        Raises:
            ValueError: If required parameters are missing.

        Example:
            tpsl_response = client.add_tpsl_order({
                "positionId": "pos123",
                "amount": 0.1,
                "side": "SELL",
                "takeProfitPrice": 35000
            })
        """
        required_keys = ['positionId', 'amount', 'side']
        if not all(key in tpsl_params for key in required_keys):
            raise ValueError(f"positionId, amount & side are required. Needed: {required_keys}")
        if 'symbol' in tpsl_params:
            tpsl_params['symbol'] = self._normalize_string(tpsl_params['symbol'])
        tpsl_params['side'] = self._normalize_string(tpsl_params['side'])
        if 'stopLossPrice' not in tpsl_params and 'takeProfitPrice' not in tpsl_params:
            raise ValueError('Either stop loss price or take profit price must be provided')
        endpoint = config.get_endpoint(['private', 'trade', 'add_tpsl'])
        return self._request('POST', endpoint, data=tpsl_params)

    def add_margin(self, margin_params: Dict[str, Any]) -> ApiResponse[MarginResponse]:
        """
        Add margin to an existing position.

        Args:
            margin_params (Dict[str, Any]): Dictionary containing parameters for margin addition.
                Must include:
                  - positionId: Identifier of the position.
                  - amount: Margin amount to add.
                Optionally include:
                  - symbol: Trading symbol (will be normalized if provided).

        Returns:
            ApiResponse[MarginResponse]: Updated margin details.

        Raises:
            ValueError: If required parameters are missing.

        Example:
            margin_response = client.add_margin({
                "positionId": "pos123",
                "amount": 100,
                "symbol": "BTCUSDT"
            })
        """
        required_keys = ['positionId', 'amount']
        if not all(key in margin_params for key in required_keys):
            raise ValueError(f"positionId and amount are required. Needed: {required_keys}")
        if 'symbol' in margin_params:
            margin_params['symbol'] = self._normalize_string(margin_params['symbol'])
        endpoint = config.get_endpoint(['private', 'trade', 'add_margin'])
        return self._request('POST', endpoint, data=margin_params)

    def reduce_margin(self, margin_params: Dict[str, Any]) -> ApiResponse[MarginResponse]:
        """
        Reduce margin from an existing position.

        Args:
            margin_params (Dict[str, Any]): Dictionary containing parameters for margin reduction.
                Must include:
                  - positionId: Identifier of the position.
                  - amount: Margin amount to reduce.
                Optionally include:
                  - symbol: Trading symbol (will be normalized if provided).

        Returns:
            ApiResponse[MarginResponse]: Updated margin details.

        Raises:
            ValueError: If required parameters are missing.

        Example:
            margin_response = client.reduce_margin({
                "positionId": "pos123",
                "amount": 50,
                "symbol": "BTCUSDT"
            })
        """
        required_keys = ['positionId', 'amount']
        if not all(key in margin_params for key in required_keys):
            raise ValueError(f"positionId and amount are required. Needed: {required_keys}")
        if 'symbol' in margin_params:
            margin_params['symbol'] = self._normalize_string(margin_params['symbol'])
        endpoint = config.get_endpoint(['private', 'trade', 'reduce_margin'])
        return self._request('POST', endpoint, data=margin_params)

    def close_position(self, close_params: Dict[str, Any]) -> ApiResponse[CreateOrderResponseData]:
        """
        Close an open position via market order execution.

        Args:
            close_params (Dict[str, Any]): Dictionary containing parameters to close a position.
                Must include:
                  - positionId: Identifier of the position to close.
                Optionally include:
                  - symbol: Trading symbol (will be normalized if provided).

        Returns:
            ApiResponse[CreateOrderResponseData]: Details of the position closure.

        Raises:
            ValueError: If positionId is not provided.

        Example:
            close_response = client.close_position({
                "positionId": "pos123",
                "symbol": "BTCUSDT"
            })
        """
        if 'positionId' not in close_params:
            raise ValueError('positionId is required')
        if 'symbol' in close_params:
            close_params['symbol'] = self._normalize_string(close_params['symbol'])
        endpoint = config.get_endpoint(['private', 'trade', 'close_position'])
        return self._request('POST', endpoint, data=close_params)

    def get_open_orders(
        self,
        symbol: str,
        limit: Optional[int] = None,
        since: Optional[int] = None
    ) -> ApiResponse[OrdersListResponse]:
        """
        Retrieve open orders for a specific trading symbol with optional pagination.

        Args:
            symbol (str): Trading symbol.
            limit (Optional[int]): Maximum number of orders to return.
            since (Optional[int]): Timestamp (in milliseconds) to filter orders placed after this time.

        Returns:
            ApiResponse[OrdersListResponse]: List of open orders.

        Raises:
            ValueError: If the symbol is not provided.

        Example:
            open_orders = client.get_open_orders("BTCUSDT", limit=10)
        """
        if not symbol:
            raise ValueError('Symbol is required')
        symbol = self._normalize_string(symbol)
        params = {'symbol': symbol}
        if limit is not None:
            params['limit'] = limit
        if since is not None:
            params['since'] = since
        endpoint = config.get_endpoint(['private', 'trade', 'open_orders'])
        return self._request('GET', endpoint, params=params)

    def get_positions(
        self,
        symbols: Optional[List[str]] = None,
        status: Optional[str] = None
    ) -> ApiResponse[List[Position]]:
        """
        Retrieve user positions, optionally filtered by trading symbols or status.

        Args:
            symbols (Optional[List[str]]): List of trading symbols (if provided, only positions for these symbols are returned).
            status (Optional[str]): Filter positions by status (e.g., 'OPEN', 'CLOSED', 'LIQUIDATED').

        Returns:
            ApiResponse[List[Position]]: List of positions.

        Example:
            positions = client.get_positions(symbols=["BTCUSDT", "ETHUSDT"], status="OPEN")
        """
        params: Dict[str, Any] = {}
        if symbols:
            params['symbols'] = [self._normalize_string(sym) for sym in symbols]
        if status:
            params['status'] = status
        endpoint = config.get_endpoint(['private', 'trade', 'positions'])
        return self._request('GET', endpoint, params=params)

    def get_user_leverage(self, symbol: str) -> ApiResponse[Leverage]:
        """
        Retrieve user-specific leverage settings for a given trading symbol.

        Args:
            symbol (str): Trading symbol.

        Returns:
            ApiResponse[Leverage]: Leverage settings for the symbol.

        Raises:
            ValueError: If the symbol is not provided.

        Example:
            leverage_info = client.get_user_leverage("BTCUSDT")
        """
        if not symbol:
            raise ValueError('Symbol is required')
        symbol = self._normalize_string(symbol)
        endpoint = config.get_endpoint(['private', 'trade', 'user_leverage'])
        return self._request('GET', endpoint, params={'symbol': symbol})

    def get_user_leverages(self) -> ApiResponse[List[Leverage]]:
        """
        Retrieve all user leverage settings.

        Returns:
            ApiResponse[List[Leverage]]: List of leverage settings for all symbols.

        Example:
            leverages = client.get_user_leverages()
        """
        endpoint = config.get_endpoint(['private', 'trade', 'user_leverages'])
        return self._request('GET', endpoint)

    def update_leverage(self, leverage_params: Dict[str, Any]) -> ApiResponse[Leverage]:
        """
        Update the leverage setting for a specified trading symbol.

        Args:
            leverage_params (Dict[str, Any]): Dictionary with leverage update parameters.
                Must include:
                  - symbol: Trading symbol (will be normalized to uppercase).
                  - leverage: New leverage value.

        Returns:
            ApiResponse[Leverage]: Updated leverage settings.

        Raises:
            ValueError: If required parameters are missing.

        Example:
            updated_leverage = client.update_leverage({
                "symbol": "BTCUSDT",
                "leverage": 10
            })
        """
        if 'symbol' not in leverage_params or 'leverage' not in leverage_params:
            raise ValueError('Symbol and leverage are required')
        leverage_params['symbol'] = self._normalize_string(leverage_params['symbol'])
        endpoint = config.get_endpoint(['private', 'trade', 'update_leverage'])
        return self._request('POST', endpoint, data=leverage_params)

    def get_order_history(
        self,
        page_size: Optional[int] = None,
        timestamp: Optional[int] = None
    ) -> ApiResponse[OrdersListResponse]:
        """
        Retrieve the user's order history with optional pagination.

        Args:
            page_size (Optional[int]): Number of orders per page.
            timestamp (Optional[int]): Timestamp in milliseconds to fetch orders before this time.

        Returns:
            ApiResponse[OrdersListResponse]: Paginated order history.

        Example:
            history = client.get_order_history(page_size=20)
        """
        params = {}
        if page_size is not None:
            params['pageSize'] = page_size
        if timestamp is not None:
            params['timestamp'] = timestamp
        endpoint = config.get_endpoint(['private', 'trade', 'order_history'])
        return self._request('GET', endpoint, params=params)

    def get_trade_history(
        self,
        page_size: Optional[int] = None,
        timestamp: Optional[int] = None
    ) -> ApiResponse[TradesListResponse]:
        """
        Retrieve the user's trade history with optional pagination.

        Args:
            page_size (Optional[int]): Number of trades per page.
            timestamp (Optional[int]): Timestamp in milliseconds to fetch trades before this time.

        Returns:
            ApiResponse[TradesListResponse]: Paginated trade history.

        Example:
            trade_history = client.get_trade_history(page_size=20)
        """
        params = {}
        if page_size is not None:
            params['pageSize'] = page_size
        if timestamp is not None:
            params['timestamp'] = timestamp
        endpoint = config.get_endpoint(['private', 'trade', 'trade_history'])
        return self._request('GET', endpoint, params=params)

    def get_transaction_history(
        self,
        page_size: Optional[int] = None,
        timestamp: Optional[int] = None
    ) -> ApiResponse[TransactionsListResponse]:
        """
        Retrieve the user's transaction history with optional pagination.

        Args:
            page_size (Optional[int]): Number of transactions per page.
            timestamp (Optional[int]): Timestamp in milliseconds to fetch transactions before this time.

        Returns:
            ApiResponse[TransactionsListResponse]: Paginated transaction history.

        Example:
            transactions = client.get_transaction_history(page_size=20)
        """
        params = {}
        if page_size is not None:
            params['pageSize'] = page_size
        if timestamp is not None:
            params['timestamp'] = timestamp
        endpoint = config.get_endpoint(['private', 'trade', 'transaction_history'])
        return self._request('GET', endpoint, params=params)
