/**
 * Futures API Client
 * A JavaScript client for interacting with the futures API
 */

const axios = require('axios');
const config = require('./utils/config');
const AuthUtils = require('./utils/auth');

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
   */
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
   * @param {Object} [data] - Request body (for POST requests)
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
          headers = AuthUtils.getApiKeyAuthHeadersForGetReq(this.apiKey, this.secretKey, params);
          // The params are now modified to include timestamp
          requestParams = { ...params, timestamp: Date.now() };
        } else {
          headers = AuthUtils.getApiKeyAuthHeadersForNonGetReq(this.apiKey, this.secretKey, data);
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
   * MARKET DATA ENDPOINTS
   */

  /**
   * Fetches the order book for a trading pair
   *
   * @param {string} symbol - Trading symbol (e.g., 'BTCUSDT')
   * @returns {Promise<Object>} Order book data
   */
  async getOrderBook(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    return this._request('GET', config.endpoints.public.market.orderBook, { symbol });
  }

  /**
   * Fetches 24-hour ticker information for a trading pair
   *
   * @param {string} symbol - Trading symbol (e.g., 'BTC/USDT')
   * @returns {Promise<Object>} 24-hour ticker information
   */
  async getTicker24Hr(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    return this._request('GET', config.endpoints.public.market.ticker24Hr, { symbol });
  }

  /**
   * Fetches all available markets
   *
   * @returns {Promise<Object>} Information about all trading markets
   */
  async getMarkets() {
    return this._request('GET', config.endpoints.public.market.markets);
  }

  /**
   * Fetches market information
   *
   * @returns {Promise<Object>} Current market information for all trading pairs
   */
  async getMarketInfo() {
    return this._request('GET', config.endpoints.public.market.marketInfo);
  }

  /**
   * Fetches aggregate trade updates for a symbol
   *
   * @param {string} symbol - Trading symbol (e.g., 'BTCINR')
   * @returns {Promise<Object>} Recent aggregate trades
   */
  async getAggTrade(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    return this._request('GET', config.endpoints.public.market.aggTrade, { symbol });
  }

  /**
   * SYSTEM ENDPOINTS
   */

  /**
   * Fetches the current system time
   *
   * @returns {Promise<Object>} Current system time
   */
  async getSystemTime() {
    return this._request('GET', config.endpoints.public.system.time);
  }

  /**
   * Fetches the current system status
   *
   * @returns {Promise<Object>} Current system status
   */
  async getSystemStatus() {
    return this._request('GET', config.endpoints.public.system.status);
  }

  /**
   * EXCHANGE ENDPOINTS
   */

  /**
   * Fetches trading fee for a specific symbol
   *
   * @param {string} symbol - Trading symbol (e.g., 'BTCUSDT')
   * @returns {Promise<Object>} Trading fee information
   */
  async getTradeFee(symbol) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    return this._request('GET', config.endpoints.public.exchange.tradefee, { symbol });
  }

  /**
   * Fetches trading fees for all supported trading pairs
   *
   * @returns {Promise<Object>} Trading fees for all pairs
   */
  async getTradeFees() {
    return this._request('GET', config.endpoints.public.exchange.tradefees);
  }

  /**
   * Fetches exchange information
   *
   * @returns {Promise<Object>} Comprehensive exchange information
   */
  async getExchangeInfo() {
    return this._request('GET', config.endpoints.public.exchange.exchangeInfo);
  }

  /**
   * Fetches information about all trading pairs
   *
   * @returns {Promise<Object>} Information about all trading pairs
   */
  async getPairs() {
    return this._request('GET', config.endpoints.public.exchange.pairs);
  }

  /**
   * WALLET ENDPOINTS (PRIVATE)
   */

  /**
   * Fetches user's wallet balance
   *
   * @returns {Promise<Object>} User's balance details
   */
  async getBalance() {
    return this._request('GET', config.endpoints.private.wallet.balance);
  }

  /**
   * TRADE ENDPOINTS (PRIVATE)
   */
  /**
   * Creates a new order
   *
   * @param {Object} orderParams - Order parameters
   * @param {string} orderParams.symbol - Trading symbol (e.g., 'BTCINR')
   * @param {number} orderParams.amount - Order amount
   * @param {string} orderParams.side - Order side ('BUY' or 'SELL')
   * @param {string} orderParams.type - Order type ('MARKET' or 'LIMIT')
   * @param {number} [orderParams.price] - Order price (required for LIMIT orders)
   * @param {number} [orderParams.stopLossPrice] - Stop loss price
   * @param {number} [orderParams.takeProfitPrice] - Take profit price
   * @param {string} orderParams.marginAsset - Margin asset (e.g., 'INR')
   * @returns {Promise<Object>} Created order details
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

    return this._request('POST', config.endpoints.private.trade.order, {}, orderParams);
  }

  /**
   * Cancels an existing order
   *
   * @param {Object} cancelParams - Cancel parameters
   * @param {string} cancelParams.clientOrderId - Client order ID
   * @param {string} cancelParams.symbol - Trading symbol
   * @returns {Promise<Object>} Cancelled order details
   */
  async cancelOrder(cancelParams) {
    if (!cancelParams.clientOrderId || !cancelParams.symbol) {
      throw new Error('Client order ID and symbol are required');
    }

    return this._request('DELETE', config.endpoints.private.trade.order, {}, cancelParams);
  }

  /**
   * Fetches details of a specific order
   *
   * @param {string} id - Client order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrder(id) {
    if (!id) {
      throw new Error('Order ID is required');
    }

    return this._request('GET', config.endpoints.private.trade.order, { id });
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
   * @returns {Promise<Object>} Created TP/SL order details
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
   * @returns {Promise<Object>} Updated position details
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
   * @returns {Promise<Object>} Updated position details
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
   * @returns {Promise<Object>} Closed position details
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
   * @returns {Promise<Object>} Open orders
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
   * @returns {Promise<Object>} Positions
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
   * @returns {Promise<Object>} User leverage settings
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
   * @returns {Promise<Object>} All user leverage settings
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
   * @returns {Promise<Object>} Updated leverage settings
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
   * @returns {Promise<Object>} Order history
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
   * @returns {Promise<Object>} Trade history
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
   * @returns {Promise<Object>} Transaction history
   */
  async getTransactionHistory(options = {}) {
    return this._request('GET', config.endpoints.private.trade.transactionHistory, options);
  }
}

module.exports = FuturesApiClient;
