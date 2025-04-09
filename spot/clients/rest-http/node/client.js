/**
 * Zebpay Spot API Client
 * A JavaScript client for interacting with the Zebpay spot API
 */

const axios = require('axios');
const config = require('./utils/config');
const AuthUtils = require('./utils/auth');
// Import types for documentation purposes
require('./utils/types');

/**
 * Spot API Client class
 */
class SpotApiClient {
  /**
   * Creates a new Spot API client instance
   *
   * @param {Object} options - Client configuration options
   * @param {string} [options.jwt] - JWT authentication token
   * @param {string} [options.apiKey] - API key for authentication
   * @param {string} [options.secretKey] - Secret key for API key authentication
   * @param {number} [options.timeout] - Request timeout in milliseconds
   * @throws {Error} If authentication credentials are missing or invalid
   * @example
   * // Create client with JWT authentication
   * const client = new SpotApiClient({ jwt: 'your-jwt-token' });
   * // Create client with API key authentication
   * const client = new SpotApiClient({
   *   apiKey: 'your-api-key',
   *   secretKey: 'your-secret-key',
   *   timeout: int_timeout_value_in_millisecs
   * });
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
    this.timeout = options.timeout || 30_000;

    // Initialize axios instance with default configuration
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: this.timeout,
    });
  }

  /**
   * Get headers for API request
   * @private
   */
  _getHeaders(method, endpoint, params = {}, data = null) {
    let headers = {
      'Content-Type': 'application/json',
    };

    // Check if endpoint requires authentication
    if (AuthUtils.isPrivateEndpoint(endpoint)) {
      if (this.jwt) {
        // Use JWT authentication
        headers = {
          ...headers,
          ...AuthUtils.getJwtAuthHeaders(this.jwt)
        };
      } else if (this.apiKey && this.secretKey) {
        // Use API key authentication
        if (method === 'GET') {
          headers = {
            ...headers,
            ...AuthUtils.getApiKeyAuthHeadersForGetReq(this.apiKey, this.secretKey, params)
          };
        } else {
          headers = {
            ...headers,
            ...AuthUtils.getApiKeyAuthHeadersForNonGetReq(this.apiKey, this.secretKey, data)
          };
        }
      }
    }

    return headers;
  }

  /**
   * Make API request
   * @private
   */
  async _request(method, endpoint, params = {}, data = null) {
    try {
      // Add timestamp to all requests
      const timestamp = Date.now();
      const requestParams = { ...params };
      const requestData = data ? { ...data } : null;
      if (method == "GET" || method == "DELETE") {
        requestParams.timestamp = timestamp;
      }
      else {
        if (requestData) {
          requestData.timestamp = timestamp;
        }
      }

      const headers = this._getHeaders(method, endpoint, requestParams, requestData);
      console.log(headers); 
      console.log(requestParams);
      console.log(requestData);
      const response = await this.http.request({
        method,
        url: endpoint,
        headers,
        params: requestParams,
        data: requestData,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }

  // Market Data APIs

  /**
   * Get all tickers
   * @returns {Promise<Object>} Ticker data
   */
  async getAllTickers() {
    return this._request('GET', config.endpoints.public.market.allTickers);
  }

  /**
   * Get K-line data
   * @param {string} symbol - Trading pair symbol
   * @param {string} interval - Candlestick interval
   * @param {number} startTime - Start time in epoch format
   * @param {number} endTime - End time in epoch format
   * @returns {Promise<Array>} K-line data
   */
  async getKline(symbol, interval, startTime, endTime) {
    return this._request('GET', config.endpoints.public.market.kline, {
      symbol,
      interval,
      startTime,
      endTime
    });
  }

  /**
   * Get order book
   * @param {string} symbol - Trading pair symbol
   * @param {number} [limit=15] - Number of orders to return
   * @returns {Promise<Object>} Order book data
   */
  async getOrderBook(symbol, limit = 15) {
    return this._request('GET', config.endpoints.public.market.orderBook, {
      symbol,
      limit
    });
  }

  /**
   * Get order book ticker
   * @param {string} symbol - Trading pair symbol
   * @returns {Promise<Object>} Order book ticker data
   */
  async getOrderBookTicker(symbol) {
    return this._request('GET', config.endpoints.public.market.orderBookTicker, {
      symbol
    });
  }

  /**
   * Get ticker for symbol
   * @param {string} symbol - Trading pair symbol
   * @returns {Promise<Object>} Ticker data
   */
  async getTicker(symbol) {
    return this._request('GET', `${config.endpoints.public.market.ticker}`, {
      symbol
    });
  }

  /**
   * Get recent trades
   * @param {string} symbol - Trading pair symbol
   * @param {number} [limit=200] - Number of trades to return
   * @param {number} [page=1] - Page number
   * @returns {Promise<Array>} Recent trades
   */
  async getRecentTrades(symbol, limit = 200, page = 1) {
    return this._request('GET', config.endpoints.public.market.trades, {
      symbol,
      limit,
      page
    });
  }

  // Exchange APIs

  /**
   * Get account balance
   * @param {string} [symbol] - Trading pair symbol
   * @param {string} [currencies] - Comma-separated list of currencies
   * @returns {Promise<Array>} Account balance
   */
  async getAccountBalance(symbol, currencies) {
    let params = {};
    if (symbol) {
      params.symbol = symbol;
    }
    else if (currencies) {
      params.currencies = currencies;
    }

    return this._request('GET', config.endpoints.private.account.balance, params);
  }

  /**
   * Get coin settings
   * @returns {Promise<Array>} Coin settings
   */
  async getCoinSettings() {
    return this._request('GET', config.endpoints.public.exchange.currencies);
  }

  /**
   * Get exchange fee
   * @param {string} code - Trading pair code
   * @param {string} side - Order side (BUY/SELL)
   * @returns {Promise<Object>} Fee information
   */
  async getExchangeFee(code, side) {
    return this._request('GET', `${config.endpoints.private.trade.fee}/${code}`, {
      side
    });
  }

  /**
   * Get orders
   * @param {string} symbol - Trading pair symbol
   * @param {string} [status] - Order status (ACTIVE, FILLED, CANCELLED, PARTIALLY_FILLED)
   * @param {number} [currentPage=1] - Current page number
   * @param {number} [pageSize=20] - Number of records per page
   * @returns {Promise<Object>} Orders
   */
  async getOrders(symbol, status, currentPage = 1, pageSize = 20) {
    return this._request('GET', config.endpoints.private.trade.orders, {
      symbol,
      status,
      currentPage,
      pageSize
    });
  }

  /**
   * Place order
   * @param {Object} order - Order parameters
   * @param {string} order.symbol - Trading pair symbol
   * @param {string} order.side - Order side (BUY/SELL)
   * @param {string} order.type - Order type
   * @param {string} [order.price] - Order price
   * @param {string} [order.quantity] - Order quantity
   * @param {string} [order.quoteOrderQty] - Quote order quantity
   * @param {string} [order.stopPrice] - Stop price
   * @param {string} [order.platform] - Platform
   * @returns {Promise<Object>} Order response
   */
  async placeOrder(order) {
    return this._request('POST', config.endpoints.private.trade.orders, null, order);
  }

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Cancel response
   */
  async cancelOrder(orderId) {
    return this._request('DELETE', `${config.endpoints.private.trade.orderDetails}/${orderId}`);
  }

  /**
   * Cancel all orders
   * @param {string} symbol - Trading pair symbol
   * @returns {Promise<Object>} Cancel response
   */
  async cancelAllOrders(symbol) {
    return this._request('DELETE', config.endpoints.private.trade.orders, {
      symbol
    });
  }

  /**
   * Get order details
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrderDetails(orderId) {
    return this._request('GET', `${config.endpoints.private.trade.orderDetails}/${orderId}`);
  }

  /**
   * Get order fills
   * @param {string} orderId - Order ID
   * @returns {Promise<Array>} Order fills
   */
  async getOrderFills(orderId) {
    return this._request('GET', `${config.endpoints.private.trade.orderFills}/${orderId}`);
  }

  /**
   * Get trading pairs
   * @returns {Promise<Object>} Trading pairs
   */
  async getTradingPairs() {
    return this._request('GET', config.endpoints.public.exchange.tradepairs);
  }

  /**
   * Get service status
   * @returns {Promise<Object>} Service status
   */
  async getServiceStatus() {
    return this._request('GET', config.endpoints.public.system.status);
  }

  /**
   * Get server time
   * @returns {Promise<Object>} Server time
   */
  async getServerTime() {
    return this._request('GET', config.endpoints.public.system.time);
  }
}

module.exports = SpotApiClient; 