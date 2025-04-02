/**
 * Futures API Client
 * A JavaScript client for interacting with the futures API
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
   * @param {number} [options.timeout] - Request timeout in milliseconds
   * @throws {Error} If authentication credentials are missing or invalid
   * @example
   * // Create client with JWT authentication
   * const client = new FuturesApiClient({ jwt: 'your-jwt-token' });
   * // Create client with API key authentication
   * const client = new FuturesApiClient({
   *   apiKey: 'your-api-key',
   *   secretKey: 'your-secret-key'
   * });
   * */
  constructor(options = {}) {
    // Validate authentication options
    if (!options.jwt && (!options.apiKey || !options.secretKey)) {
      throw new Error('Authentication credentials are required. Provide either a JWT token or an API key and secret key.');
    }

    // Initialize client properties
    this.jwt = options.jwt;
    this.apiKey = options.apiKey;
    this.secretKey = options.secretKey;
    this.timeout = options.timeout || config.timeout;

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
      const isPrivate = AuthUtils.isPrivateEndpoint(endpoint);
      const isApiKey = isPrivate && !this.jwt && this.apiKey && this.secretKey;

      // For API key authentication, the authentication utility adds timestamp
      // and we need to create a modified version of the data
      let requestData = data;
      let requestParams = params;
      let headers = {};

      // Get authentication headers
      if (isApiKey) {
        if (method.toUpperCase() === 'GET') {
          headers = AuthUtils.getApiKeyAuthHeadersForGet(this.apiKey, this.secretKey, params);
          // The params are now modified to include timestamp
          requestParams = { ...params, timestamp: Date.now() };
        } else {
          headers = AuthUtils.getApiKeyAuthHeadersForPost(this.apiKey, this.secretKey, data);
          // The data is now modified to include timestamp
          requestData = { ...data, timestamp: Date.now() };
        }
      } else {
        headers = this._getHeaders(method, endpoint, params, data);
      }

      const response = await this.http.request({
        method,
        url: endpoint,
        params: requestParams,
        data: requestData,
        headers
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with an error status
        throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error(`Request Error: No response received from server`);
      } else {
        // Something happened in setting up the request
        throw new Error(`Request Setup Error: ${error.message}`);
      }
    }
  }

  /**
   * MARKET DATA ENDPOINTS (PUBLIC)
   */

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

    return await this._request('GET', config.endpoints.public.market.aggTrade, { symbol });
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
  * @returns {Promise<ApiResponse<{
  *   symbol: string,
  *   makerFee: number,
  *   takerFee: number
  * }>>} Trading fee information
  */
  async getTradeFee(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    return await this._request('GET', config.endpoints.public.exchange.tradefee, { symbol });
  }

  /**
  * Fetches trading fees for all supported trading pairs
  *
  * @returns {Promise<ApiResponse<Array<{
  *   symbol: string,
  *   makerFee: number,
  *   takerFee: number
  * }>>>} Trading fees for all pairs
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
    try {
      return await this._request('GET', config.endpoints.public.exchange.pairs);
    }
    catch(e) {
      throw e;
    }
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
   * @param {string} orderParams.type - Order type ('MARKET' or 'LIMIT'), will be converted to uppercase
   * @param {number} [orderParams.price] - Order price (required for LIMIT orders), must be positive
   * @param {number} [orderParams.stopLossPrice] - Stop loss price
   * @param {number} [orderParams.takeProfitPrice] - Take profit price
   * @param {string} [orderParams.marginAsset] - Margin asset (e.g., 'USDT')
   * @returns {Promise<ApiResponse<CreateOrderResponseData>>} Response with order creation details
   * @throws {Error} If required parameters are missing or invalid
  */
  async createOrder(orderParams) {
    // Validate required parameters
    if (!orderParams.symbol || !orderParams.amount || !orderParams.side || !orderParams.type || !orderParams.marginAsset) {
      throw new Error('Required order parameters missing');
    }

    // Validate price for LIMIT orders
    if (orderParams.type === 'LIMIT' && !orderParams.price) {
      throw new Error('Price is required for LIMIT orders');
    }

    return await this._request('POST', config.endpoints.private.trade.order, {}, orderParams);
  }

  /**
   * Cancels an existing order
   *
   * @param {Object} cancelParams - Cancel parameters
   * @param {string} cancelParams.clientOrderId - Client order ID
   * @param {string} [cancelParams.symbol] - Trading symbol (optional)
   * @returns {Promise<ApiResponse<CanceledOrder>>} Cancelled order details
   * @throws {Error} When clientOrderId is missing
  */
  async cancelOrder(cancelParams) {
    if (!cancelParams.clientOrderId) {
      throw new Error('Client order ID is required');
    }
    return await this._request('DELETE', config.endpoints.private.trade.order, {}, cancelParams);
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
   * Adds take-profit or stop-loss order to an existing position
   *
   * @param {Object} tpslParams - TP/SL parameters
   * @param {string} tpslParams.symbol - Trading symbol
   * @param {string} tpslParams.positionId - Position ID
   * @param {number} tpslParams.amount - Order amount
   * @param {string} tpslParams.side - Order side ('buy' or 'sell')
   * @param {number} [tpslParams.stopLossPrice] - Stop loss price
   * @param {number} [tpslParams.takeProfitPrice] - Take profit price
   * @returns {Promise<ApiResponse<Order>>} Created TP/SL order details
   */
  async addTPSLOrder(tpslParams) {
    if (!tpslParams.symbol || !tpslParams.positionId || !tpslParams.amount || !tpslParams.side) {
      throw new Error('Required parameters missing');
    }

    if (!tpslParams.stopLossPrice && !tpslParams.takeProfitPrice) {
      throw new Error('Either stop loss price or take profit price must be provided');
    }

    return this._request('POST', config.endpoints.private.trade.addTPSL, {}, tpslParams);
  }

  /**
   * Adds margin to a position
   *
   * @param {Object} marginParams - Add margin parameters
   * @param {string} marginParams.symbol - Trading symbol
   * @param {string} marginParams.positionId - Position ID
   * @param {number} marginParams.amount - Margin amount to add
   * @returns {Promise<ApiResponse<MarginResponse>>} Updated position details
   */
  async addMargin(marginParams) {
    if (!marginParams.symbol || !marginParams.positionId || !marginParams.amount) {
      throw new Error('Required parameters missing');
    }

    return this._request('POST', config.endpoints.private.trade.addMargin, {}, marginParams);
  }

  /**
   * Reduces margin from a position
   *
   * @param {Object} marginParams - Reduce margin parameters
   * @param {string} marginParams.symbol - Trading symbol
   * @param {string} marginParams.positionId - Position ID
   * @param {number} marginParams.amount - Margin amount to reduce
   * @returns {Promise<ApiResponse<MarginResponse>>} Updated position details
   */
  async reduceMargin(marginParams) {
    if (!marginParams.symbol || !marginParams.positionId || !marginParams.amount) {
      throw new Error('Required parameters missing');
    }

    return this._request('POST', config.endpoints.private.trade.reduceMargin, {}, marginParams);
  }

  /**
   * Closes a position
   *
   * @param {Object} closeParams - Close position parameters
   * @param {string} closeParams.symbol - Trading symbol
   * @param {string} closeParams.positionId - Position ID
   * @returns {Promise<ApiResponse<Order>>} Closed position details
   */
  async closePosition(closeParams) {
    if (!closeParams.symbol || !closeParams.positionId) {
      throw new Error('Symbol and position ID are required');
    }

    return this._request('POST', config.endpoints.private.trade.closePosition, {}, closeParams);
  }

  /**
   * Fetches open orders for a symbol
   *
   * @param {string} symbol - Trading symbol
   * @param {Object} [options] - Additional options
   * @param {number} [options.limit] - Maximum number of orders to return
   * @param {number} [options.since] - Timestamp to fetch orders placed after this time
   * @returns {Promise<ApiResponse<{data: Order[], totalCount: number, nextTimestamp: number}>>} Open orders
   */
  async getOpenOrders(symbol, options = {}) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    const params = {
      symbol,
      ...options
    };

    return this._request('GET', config.endpoints.private.trade.openOrders, params);
  }

  /**
   * Fetches positions
   *
   * @param {string[]} symbols - Array of trading symbols
   * @param {string} [status] - Filter positions by status (OPEN, CLOSED, LIQUIDATED)
   * @returns {Promise<ApiResponse<Position[]>>} Positions
   */
  async getPositions(symbols, status) {
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      throw new Error('At least one symbol is required');
    }

    const params = {
      symbols,
      ...(status && { status })
    };

    return this._request('GET', config.endpoints.private.trade.positions, params);
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

    return this._request('GET', config.endpoints.private.trade.userLeverage, { symbol });
  }

  /**
   * Fetches all user leverage settings
   *
   * @returns {Promise<ApiResponse<Leverage[]>>} All user leverage settings
   */
  async getUserLeverages() {
    return this._request('GET', config.endpoints.private.trade.userLeverages);
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
    if (!leverageParams.symbol || leverageParams.leverage === undefined) {
      throw new Error('Symbol and leverage are required');
    }

    return this._request('POST', config.endpoints.private.trade.updateLeverage, {}, leverageParams);
  }

  /**
   * Fetches order history
   *
   * @param {Object} [options] - Additional options
   * @param {number} [options.pageSize] - Number of orders to return per page
   * @param {number} [options.timestamp] - Timestamp to fetch orders before this time
   * @returns {Promise<ApiResponse<{data: Order[], totalCount: number, nextTimestamp: number}>>} Order history
   */
  async getOrderHistory(options = {}) {
    return this._request('GET', config.endpoints.private.trade.orderHistory, options);
  }

  /**
   * Fetches trade history
   *
   * @param {Object} [options] - Additional options
   * @param {number} [options.pageSize] - Number of trades to return per page
   * @param {number} [options.timestamp] - Timestamp to fetch trades before this time
   * @returns {Promise<ApiResponse<{data: Trade[], totalCount: number, nextTimestamp: number}>>} Trade history
   */
  async getTradeHistory(options = {}) {
    return this._request('GET', config.endpoints.private.trade.tradeHistory, options);
  }

  /**
   * Fetches transaction history
   *
   * @param {Object} [options] - Additional options
   * @param {number} [options.pageSize] - Number of transactions to return per page
   * @param {number} [options.timestamp] - Timestamp to fetch transactions before this time
   * @returns {Promise<ApiResponse<{data: Transaction[], totalCount: number, nextTimestamp: number}>>} Transaction history
   */
  async getTransactionHistory(options = {}) {
    return this._request('GET', config.endpoints.private.trade.transactionHistory, options);
  }
}

module.exports = FuturesApiClient;
