/**
 * Zebpay Futures API Client
 * A JavaScript client for interacting with the Zebpay futures API
 */

const axios = require('axios');
const config = require('./utils/config');
const AuthUtils = require('./utils/auth');
// Import types for documentation purposes
require('./utils/types');

/**
 * Futures API Client class
 */
class FuturesApiClient {
  /**
   * Creates a new Futures API client instance
   *
   * @param {Object} options - Client configuration options
   * @param {string} [options.jwt] - JWT authentication token
   * @param {string} [options.apiKey] - API key for authentication
   * @param {string} [options.secretKey] - Secret key for API key authentication
   * @param {string} [options.subaccountId] - Optional subaccount ID
   * @param {number} [options.timeout] - Request timeout in milliseconds
   * @throws {Error} If authentication credentials are incomplete or ambiguous
   * @example
   * // Create client with JWT authentication
   * const client = new FuturesApiClient({ jwt: 'your-jwt-token' });
   * // Create client with API key authentication
   * const client = new FuturesApiClient({
   *   apiKey: 'your-api-key',
   *   secretKey: 'your-secret-key',
   *   timeout: int_timeout_value_in_millisecs
   * });
   */
  constructor(options = {}) {
    const hasJwt = Boolean(options.jwt);
    const hasApiKeyCredentials = Boolean(options.apiKey || options.secretKey);
    if (hasJwt && hasApiKeyCredentials) {
      throw new Error('JWT and API key authentication are mutually exclusive.');
    }
    if (hasApiKeyCredentials && (!options.apiKey || !options.secretKey)) {
      throw new Error('Both apiKey and secretKey are required.');
    }

    // Initialize client properties
    this.jwt = options.jwt;
    this.apiKey = options.apiKey;
    this.secretKey = options.secretKey;
    this.subaccountId = options.subaccountId;
    this.timeout = options.timeout || 30_000;

    // Initialize axios instance with default configuration
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Prepares request headers based on authentication method
   *
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} endpoint - API endpoint
   * @param {Object} [params] - Query parameters
   * @param {Object} [data] - Request body
   * @returns {Object} Request headers
   * @private
   */
  _getHeaders(method, endpoint, params = {}, data = null) {
    // Determine if endpoint requires authentication
    const isPrivate = AuthUtils.isPrivateEndpoint(endpoint);

    if (!isPrivate) {
      // Public endpoint, no authentication required
      return {};
    }

    // Private endpoint, authentication required
    if (this.jwt) {
      // JWT authentication
      return AuthUtils.getJwtAuthHeaders(this.jwt);
    } else {
      // API key authentication
      if (method.toUpperCase() === 'GET') {
        return AuthUtils.getApiKeyAuthHeadersForGetReq(this.apiKey, this.secretKey, params);
      } else {
        return AuthUtils.getApiKeyAuthHeadersForNonGetReq(this.apiKey, this.secretKey, data);
      }
    }
  }

  /**
   * Sends an HTTP request to the API
   *
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} endpoint - API endpoint
   * @param {Object} [params] - Query parameters
   * @param {Object} [data] - Request body (for POST requests)
   * @returns {Promise<Object>} API response
   * @private
   */
  async _request(method, endpoint, params = {}, data = null) {
    try {
      const requestMethod = method.toUpperCase();
      const requestParams = { ...(params || {}) };
      let requestData = data === null ? null : { ...data };
      const isPrivate = AuthUtils.isPrivateEndpoint(endpoint);
      if (isPrivate && !this.jwt && !(this.apiKey && this.secretKey)) {
        throw new Error('Authentication credentials are required for private endpoints.');
      }
      const isApiKeyRequest = isPrivate && !this.jwt && this.apiKey && this.secretKey;

      // API-key authentication requires the same timestamp to be present in
      // both the signed payload and the payload sent over the wire.
      if (isApiKeyRequest) {
        if (requestMethod === 'GET') {
          requestParams.timestamp = Date.now();
        } else {
          requestData = { ...(requestData || {}), timestamp: Date.now() };
        }
      }

      // Get authentication headers
      const headers = this._getHeaders(requestMethod, endpoint, requestParams, requestData);
      if (isPrivate && this.subaccountId) {
        headers.subaccountid = this.subaccountId;
      }
      const url =`${config.baseUrl}${endpoint}`;
      const requestPayload = { method: requestMethod, url, headers };
      if (requestMethod === 'GET') {
        requestPayload.params = requestParams;
        if (isApiKeyRequest) {
          requestPayload.paramsSerializer = {
            serialize: AuthUtils.serializeQueryParams
          };
        }
      } else if (requestData !== null) {
        requestPayload.data = requestData;
      }
      const response = await this.http.request(requestPayload);
      return response.data;
    } catch (error) {
      // Preserve original error message and additional context if available
      if (error.response) {
        // The request was made and the server responded with an error status
        throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`, { cause: error });
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error(`Request Error: No response received from server`, {cause: error});
      } else {
        // Something happened in setting up the request
        throw new Error(`Request Setup Error: ${error.message}`, { cause: error });
      }
    }
  }

  /**
   * Utility method to normalize strings to uppercase if they are provided.
   *
   * @param {string} value - The string value to normalize.
   * @returns {string} Uppercase string.
   * @private
   */
  _normalizeString(value) {
    return typeof value === 'string' ? value.toUpperCase() : value;
  }

  /**
   * MARKET DATA ENDPOINTS (PUBLIC)
   */

  /**
   * Fetches information about all available markets (trading symbols) and exchange metadata.
   *
   * @returns {Promise<ApiResponse<MarketsData>>} Object containing server time, rate limits, and a list of symbol details. [cite: User-provided Fetch Market Response]
   * @see {ApiResponse} For the overall response structure [cite: futures/api-reference/data-models.md]
   * @see {MarketsData} For the structure of the data field [cite: futures/clients/rest-http/node/utils/types.js]
   */
  async fetchMarkets() {
    // The endpoint path is sourced from the config file
    return await this._request('GET', config.endpoints.public.market.markets);  //[cite: futures/clients/rest-http/node/utils/config.js]
  }

  /**
   * Fetches the order book for a trading pair
   *
   * @param {string} symbol - Trading symbol (e.g., 'BTCUSDT')
   * @returns {Promise<ApiResponse<OrderBook>>} Order book data
   * @see {ApiResponse} For the overall response structure
   * @see {OrderBook} For the structure of the data field
   */
  async getOrderBook(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }
    symbol = this._normalizeString(symbol);
    return await this._request('GET', config.endpoints.public.market.orderBook, { symbol });
  }

  /**
   * Fetches 24-hour ticker information for a trading pair
   *
   * @param {string} symbol - Trading symbol (e.g., 'BTCUSDT')
   * @returns {Promise<ApiResponse<Ticker>>} 24-hour ticker information
   */
  async getTicker24Hr(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }
    symbol = this._normalizeString(symbol);
    return await this._request('GET', config.endpoints.public.market.ticker24Hr, { symbol });
  }

  /**
   * Fetches market information
   *
   * @returns {Promise<ApiResponse<Object.<string, MarketInfo>>>} Current market information for all trading pairs
   */
  async getMarketInfo() {
    return await this._request('GET', config.endpoints.public.market.marketInfo);
  }

  /**
   * Fetches aggregate trade updates for a symbol
   *
   * @param {string} symbol - Trading symbol (e.g., 'BTCINR')
   * @returns {Promise<ApiResponse<AggregateTrade[]>>} Recent aggregate trades
   */
  async getAggTrade(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }
    symbol = this._normalizeString(symbol);
    return await this._request('GET', config.endpoints.public.market.aggTrade, { symbol });
  }

  /**
   * Fetches k-line (candlestick) data for a symbol
   *
   * @param {Object} klineParams - K-line parameters
   * @param {string} klineParams.symbol - Trading symbol (e.g., 'BTCINR')
   * @param {string} klineParams.interval - Candlestick interval (e.g., '1m', '5m', '1h', '1d')
   * @param {number} [klineParams.startTime] - Start time in milliseconds
   * @param {number} [klineParams.endTime] - End time in milliseconds
   * @param {number} [klineParams.limit] - Maximum number of data points to return
   * @returns {Promise<ApiResponse<Array<number|string>>>} K-line data
   */
  async getKlines(klineParams) {
    if (!klineParams.symbol || !klineParams.interval) {
      throw new Error('Symbol and interval are required');
    }
    klineParams.symbol = this._normalizeString(klineParams.symbol);
    return await this._request('POST', config.endpoints.public.market.klines, {}, klineParams);
  }

  /**
   * SYSTEM ENDPOINTS (PUBLIC)
   */

  /**
   * Fetches the current system time
   *
   * @returns {Promise<ApiResponse<{timestamp: number}>>} Current system time in milliseconds
   */
  async getSystemTime() {
    return await this._request('GET', config.endpoints.public.system.time);
  }

  /**
   * Fetches the current system status
   *
   * @returns {Promise<ApiResponse<{status: "ok" | "error"}>>} Current system status
   */
  async getSystemStatus() {
    return await this._request('GET', config.endpoints.public.system.status);
  }

  /**
   * EXCHANGE ENDPOINTS (PUBLIC)
   */

  /**
   * Fetches trading fee for a specific symbol
   *
   * @param {string} symbol - Trading symbol (e.g., 'BTCUSDT')
   * @returns {Promise<ApiResponse<{symbol: string, makerFee: number, takerFee: number}>>} Trading fee information
   */
  async getTradeFee(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }
    symbol = this._normalizeString(symbol);
    return await this._request('GET', config.endpoints.public.exchange.tradefee, { symbol });
  }

  /**
   * Fetches trading fees for all supported trading pairs
   *
   * @returns {Promise<ApiResponse<Array<{symbol: string, makerFee: number, takerFee: number}>>>} Trading fees for all pairs
   */
  async getTradeFees() {
    return await this._request('GET', config.endpoints.public.exchange.tradefees);
  }

  /**
   * Fetches detailed exchange configuration
   *
   * Retrieves comprehensive information about available trading pairs, quote currencies,
   * category classifications, and conversion rates on the exchange.
   *
   * @returns {Promise<ApiResponse<ExchangeInfo>>} Exchange information including trading pairs,
   * fee structures, leverage options, supported currencies, and conversion rates.
   */
  async getExchangeInfo() {
    return await this._request('GET', config.endpoints.public.exchange.exchangeInfo);
  }

  /**
   * Fetches information about all trading pairs
   *
   * Retrieves all available trading pairs, transaction types, quote currencies,
   * asset categories, and current conversion rates.
   *
   * @returns {Promise<ApiResponse<PairsInfo>>} API response containing pairs information,
   *          including active status, icons, base/quote assets, and conversion rates
   */
  async getPairs() {
    return await this._request('GET', config.endpoints.public.exchange.pairs);
  }

  /**
   * WALLET ENDPOINTS (PRIVATE)
   */

  /**
   * Fetches user's wallet balance
   *
   * @returns {Promise<ApiResponse<WalletBalance>>} User's balance details
   */
  async getBalance() {
    return await this._request('GET', config.endpoints.private.wallet.balance);
  }

  /**
   * TRADE ENDPOINTS (PRIVATE)
   */

  /**
   * Creates a new order
   *
   * @param {Object} orderParams - Order parameters
   * @param {string} orderParams.symbol - Trading symbol (e.g., 'BTCUSDT'), will be converted to uppercase
   * @param {number} orderParams.amount - Order amount in base asset
   * @param {string} orderParams.side - Order side ('BUY' or 'SELL'), will be converted to uppercase
   * @param {string} orderParams.type - MARKET, LIMIT, STOP_MARKET, or STOP_LIMIT
   * @param {number} [orderParams.price] - Required for LIMIT and STOP_LIMIT orders
   * @param {number} [orderParams.triggerPrice] - Required for STOP_MARKET and STOP_LIMIT orders
   * @param {number} [orderParams.stopLossPrice] - Stop loss price
   * @param {number} [orderParams.takeProfitPrice] - Take profit price
   * @param {string} [orderParams.marginAsset] - Margin asset (e.g., 'USDT'), will be converted to uppercase
   * @returns {Promise<ApiResponse<CreateOrderResponseData>>} Response with order creation details
   * @throws {Error} If required parameters are missing or invalid
   */
  async createOrder(orderParams) {
    if (!orderParams || !orderParams.symbol || !orderParams.amount || !orderParams.side || !orderParams.type) {
      throw new Error('Required order parameters missing');
    }

    const normalizedParams = {
      ...orderParams,
      symbol: this._normalizeString(orderParams.symbol),
      side: this._normalizeString(orderParams.side),
      type: this._normalizeString(orderParams.type)
    };
    if (orderParams.marginAsset) {
      normalizedParams.marginAsset = this._normalizeString(orderParams.marginAsset);
    }

    const supportedTypes = ['MARKET', 'LIMIT', 'STOP_MARKET', 'STOP_LIMIT'];
    if (!supportedTypes.includes(normalizedParams.type)) {
      throw new Error(`Order type must be one of: ${supportedTypes.join(', ')}`);
    }
    if (!['BUY', 'SELL'].includes(normalizedParams.side)) {
      throw new Error('Order side must be BUY or SELL');
    }
    if (normalizedParams.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (['LIMIT', 'STOP_LIMIT'].includes(normalizedParams.type) &&
        (!normalizedParams.price || normalizedParams.price <= 0)) {
      throw new Error(`Price is required for ${normalizedParams.type} orders and must be positive`);
    }
    if (['STOP_MARKET', 'STOP_LIMIT'].includes(normalizedParams.type) &&
        (!normalizedParams.triggerPrice || normalizedParams.triggerPrice <= 0)) {
      throw new Error(`Trigger price is required for ${normalizedParams.type} orders and must be positive`);
    }
    if (normalizedParams.type === 'STOP_LIMIT') {
      const invalidBuyPrice = normalizedParams.side === 'BUY' &&
        normalizedParams.price < normalizedParams.triggerPrice;
      const invalidSellPrice = normalizedParams.side === 'SELL' &&
        normalizedParams.price > normalizedParams.triggerPrice;
      if (invalidBuyPrice || invalidSellPrice) {
        throw new Error('STOP_LIMIT price must be >= triggerPrice for BUY and <= triggerPrice for SELL');
      }
    }

    return await this._request('POST', config.endpoints.private.trade.order, {}, normalizedParams);
  }

  /**
   * Cancels an existing order
   *
   * @param {Object} cancelParams - Cancel parameters
   * @param {string} cancelParams.clientOrderId - Client order ID
   * @param {string} [cancelParams.symbol] - Trading symbol (optional)
   * @returns {Promise<ApiResponse<CancelOrderResponseData>>} Cancelled order details
   * @throws {Error} When clientOrderId is missing
   */
  async cancelOrder(cancelParams) {
    if (!cancelParams.clientOrderId) {
      throw new Error('Client order ID is required');
    }
    // Normalize symbol if provided
    if (cancelParams.symbol) {
      cancelParams.symbol = this._normalizeString(cancelParams.symbol);
    }
    return await this._request('DELETE', config.endpoints.private.trade.order, {}, cancelParams);
  }

  /**
   * Edits an existing order
   *
   * @param {Object} orderParams - Order parameters
   * @param {string} orderParams.clientOrderId - The unique identifier for the order you wish to edit.
   * @param {number} [orderParams.price] - The new price for the order.
   * @param {number} [orderParams.amount] - The new quantity for the order.
   * @param {number} [orderParams.triggerPrice] - The new trigger price for stop or take-profit orders.
   * @returns {Promise<ApiResponse<EditOrderResponseData>>} Edited order details
   * @throws {Error} When clientOrderId is missing
   */
  async editOrder(orderParams) {
    if (!orderParams.clientOrderId) {
      throw new Error('Client order ID is required');
    }
    return await this._request('PATCH', config.endpoints.private.trade.order, {}, orderParams);
  }

    /**
     * Cancels all open orders
     *
     * @returns {Promise<ApiResponse<CancelOrderResponseData[]>>} A list of all canceled orders
     */
    async cancelAllOrders() {
        return await this._request('DELETE', config.endpoints.private.trade['order/all']);
    }

  /**
   * Fetches details of a specific order
   *
   * @param {string} id - Client order ID
   * @returns {Promise<ApiResponse<Order>>} Order details
   */
  async getOrder(id) {
    if (!id) {
      throw new Error('Order ID is required');
    }
    return await this._request('GET', config.endpoints.private.trade.order, { id });
  }

  /**
   * Adds one take-profit (TP) or one stop-loss (SL) order to an existing position
   *
   * These orders help secure profits or limit losses automatically when certain price levels are reached.
   *
   * @param {Object} tpslParams - TP/SL parameters
   * @param {string} tpslParams.symbol - Trading symbol (e.g., 'BTCUSDT')
   * @param {string} tpslParams.positionId - Unique identifier of the position to attach the TP/SL order to
   * @param {number} tpslParams.amount - Order amount in base asset (e.g., 0.001 BTC)
   * @param {string} tpslParams.side - Order side ('BUY' or 'SELL') - Will be converted to uppercase
   * @param {number} [tpslParams.stopLossPrice] - Stop loss trigger price - Required if takeProfitPrice is not provided
   * @param {number} [tpslParams.takeProfitPrice] - Take profit trigger price - Required if stopLossPrice is not provided
   * @returns {Promise<ApiResponse<AddTPSLResponseData>>} Created TP/SL order details
   *
   * @example
   * // Adding a take profit order
   * client.addTPSLOrder({
   *   symbol: 'BTCINR',
   *   positionId: 'ae53c264-819f-457b-806e-a1d29802962e',
   *   amount: 0.001,
   *   side: 'sell',
   *   takeProfitPrice: 9000000
   * });
   */
  async addTPSLOrder(tpslParams) {
    if (!tpslParams || !tpslParams.positionId || !tpslParams.amount || !tpslParams.side || !tpslParams.symbol) {
      throw new Error('positionId, amount, side & symbol are required parameters');
    }
    // Normalize parameters if provided
    if (tpslParams.symbol) {
      tpslParams.symbol = this._normalizeString(tpslParams.symbol);
    }
    tpslParams.side = this._normalizeString(tpslParams.side);

    const hasStopLoss = tpslParams.stopLossPrice !== undefined;
    const hasTakeProfit = tpslParams.takeProfitPrice !== undefined;
    if (hasStopLoss === hasTakeProfit) {
      throw new Error('Exactly one of stopLossPrice or takeProfitPrice must be provided');
    }
    const triggerPrice = hasStopLoss ? tpslParams.stopLossPrice : tpslParams.takeProfitPrice;
    if (tpslParams.amount <= 0 || triggerPrice <= 0) {
      throw new Error('Amount and TP/SL trigger price must be positive');
    }

    return await this._request('POST', config.endpoints.private.trade.addTPSL, {}, tpslParams);
  }

  /**
   * Adds margin to a position
   *
   * @param {Object} marginParams - Add margin parameters
   * @param {string} [marginParams.symbol] - Trading symbol (Optional)
   * @param {string} marginParams.positionId - Position ID
   * @param {number} marginParams.amount - Margin amount to add
   * @returns {Promise<ApiResponse<MarginResponse>>} Updated position details
   */
  async addMargin(marginParams) {
    if (!marginParams.positionId || !marginParams.amount) {
      throw new Error('positionId and amount are required parameters');
    }
    // Normalize symbol if provided
    if (marginParams.symbol) {
      marginParams.symbol = this._normalizeString(marginParams.symbol);
    }
    return await this._request('POST', config.endpoints.private.trade.addMargin, {}, marginParams);
  }

  /**
   * Reduces margin from a position
   *
   * @param {Object} marginParams - Reduce margin parameters
   * @param {string} [marginParams.symbol] - Trading symbol (Optional)
   * @param {string} marginParams.positionId - Position ID
   * @param {number} marginParams.amount - Margin amount to reduce
   * @returns {Promise<ApiResponse<MarginResponse>>} Updated position details
   */
  async reduceMargin(marginParams) {
    if (!marginParams.positionId || !marginParams.amount) {
      throw new Error('positionId and amount are required parameters');
    }
    // Normalize symbol if provided
    if (marginParams.symbol) {
      marginParams.symbol = this._normalizeString(marginParams.symbol);
    }
    return await this._request('POST', config.endpoints.private.trade.reduceMargin, {}, marginParams);
  }

  /**
   * Closes a position at MARKET
   *
   * @param {Object} closeParams - Close position parameters
   * @param {string} [closeParams.symbol] - Trading symbol (e.g., 'BTCUSDT') (optional)
   * @param {string} closeParams.positionId - Position ID
   * @returns {Promise<ApiResponse<ClosePositionResponseData>>} Closed position details including execution details
   *
   * @example
   * // Close a BTC position
   * const result = await client.closePosition({
   *   symbol: 'BTCUSDT',
   *   positionId: '123456789'
   * });
   */
  async closePosition(closeParams) {
    if (!closeParams.positionId) {
      throw new Error('positionId is required');
    }
    // Normalize symbol if provided
    if (closeParams.symbol) {
      closeParams.symbol = this._normalizeString(closeParams.symbol);
    }
    return await this._request('POST', config.endpoints.private.trade.closePosition, {}, closeParams);
  }

  /**
   * Fetches open orders for a symbol
   *
   * @param {string} symbol - Trading symbol
   * @param {Object} [options] - Additional options
   * @param {number} [options.limit] - Maximum number of orders to return
   * @param {number} [options.since] - Timestamp to fetch orders placed after this time
   * @returns {Promise<ApiResponse<OrdersListResponse>>} Open orders
   */
  async getOpenOrders(symbol, options = {}) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }
    symbol = this._normalizeString(symbol);
    const params = {
      symbol,
      ...options
    };
    return await this._request('GET', config.endpoints.private.trade.openOrders, params);
  }

  /**
   * Fetches positions
   *
   * @param {string[]} [symbols] - Array of trading symbols; if empty or not provided all positions will be returned
   * @param {string} [status] - Filter positions by status (OPEN, CLOSED, LIQUIDATED)
   * @returns {Promise<ApiResponse<Position[]>>} Positions
   */
  async getPositions(symbols = [], status=undefined) {
    // Normalize symbols array if provided
    if (Array.isArray(symbols) && symbols.length > 0) {
      symbols = symbols.map(sym => this._normalizeString(sym));
    }
    const params = {
      symbols,
    };
    if(status) params.status=status;
    return await this._request('GET', config.endpoints.private.trade.positions, params);
  }

  /**
   * Fetches user leverage for a specific symbol
   *
   * @param {string} symbol - Trading symbol
   * @returns {Promise<ApiResponse<Leverage>>} User leverage settings
   */
  async getUserLeverage(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }
    symbol = this._normalizeString(symbol);
    return await this._request('GET', config.endpoints.private.trade.userLeverage, { symbol });
  }

  /**
   * Fetches all user leverage settings
   *
   * @returns {Promise<ApiResponse<Leverage[]>>} All user leverage settings
   */
  async getUserLeverages() {
    return await this._request('GET', config.endpoints.private.trade.userLeverages);
  }

  /**
   * Updates user leverage
   *
   * @param {Object} leverageParams - Update leverage parameters
   * @param {string} leverageParams.symbol - Trading symbol
   * @param {number} leverageParams.leverage - New leverage value
   * @returns {Promise<ApiResponse<Leverage>>} Updated leverage settings
   */
  async updateLeverage(leverageParams) {
    if (!leverageParams.symbol || !leverageParams.leverage) {
      throw new Error('Symbol and leverage are required');
    }
    leverageParams.symbol = this._normalizeString(leverageParams.symbol);
    return await this._request('POST', config.endpoints.private.trade.updateLeverage, {}, leverageParams);
  }

  /**
   * Fetches order history with pagination
   *
   * @param {Object} [options] - Filter and pagination options
   * @param {number} [options.pageSize] - Number of orders to return per page
   * @param {number} [options.timestamp] - Unix timestamp in milliseconds to fetch orders before this time
   * @returns {Promise<ApiResponse<OrdersListResponse>>} Paginated order history
   */
  async getOrderHistory(options = {}) {
    return await this._request('GET', config.endpoints.private.trade.orderHistory, options);
  }

  /**
   * Fetches trade history with pagination
   *
   * @param {Object} [options] - Filter and pagination options
   * @param {number} [options.pageSize] - Number of trades to return per page
   * @param {number} [options.timestamp] - Unix timestamp in milliseconds to fetch trades before this time
   * @returns {Promise<ApiResponse<TradesListResponse>>} Paginated trade history
   */
  async getTradeHistory(options = {}) {
    return await this._request('GET', config.endpoints.private.trade.tradeHistory, options);
  }

  /**
   * Fetches transaction history with pagination
   *
   * @param {Object} [options] - Filter and pagination options
   * @param {number} [options.pageSize] - Number of transactions to return per page
   * @param {number} [options.timestamp] - Unix timestamp in milliseconds to fetch transactions before this time
   * @returns {Promise<ApiResponse<TransactionsListResponse>>} Paginated transaction history
   */
  async getTransactionHistory(options = {}) {
    return await this._request('GET', config.endpoints.private.trade.transactionHistory, options);
  }
}

module.exports = FuturesApiClient;
