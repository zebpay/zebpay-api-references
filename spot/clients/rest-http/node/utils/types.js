/**
 * Type definitions for Zebpay Spot API
 */

/**
 * @typedef {Object} Ticker
 * @property {string} symbol - Trading pair symbol
 * @property {string} price - Current price
 * @property {string} priceChange - Price change
 * @property {string} priceChangePercent - Price change percentage
 * @property {string} high - 24h high price
 * @property {string} low - 24h low price
 * @property {string} volume - 24h volume
 * @property {string} quoteVolume - 24h quote volume
 * @property {string} lastPrice - Last trade price
 * @property {string} bidPrice - Best bid price
 * @property {string} askPrice - Best ask price
 */

/**
 * @typedef {Object} OrderBook
 * @property {Array<Array<string>>} bids - Array of bid orders [price, quantity]
 * @property {Array<Array<string>>} asks - Array of ask orders [price, quantity]
 */

/**
 * @typedef {Object} Trade
 * @property {string} id - Trade ID
 * @property {string} price - Trade price
 * @property {string} quantity - Trade quantity
 * @property {string} time - Trade timestamp
 * @property {boolean} isBuyerMaker - Whether the buyer is the maker
 */

/**
 * @typedef {Object} Kline
 * @property {number} openTime - Open time
 * @property {string} open - Open price
 * @property {string} high - High price
 * @property {string} low - Low price
 * @property {string} close - Close price
 * @property {string} volume - Volume
 * @property {number} closeTime - Close time
 * @property {string} quoteVolume - Quote volume
 * @property {number} trades - Number of trades
 * @property {string} takerBuyBaseVolume - Taker buy base volume
 * @property {string} takerBuyQuoteVolume - Taker buy quote volume
 */

/**
 * @typedef {Object} Balance
 * @property {string} asset - Asset symbol
 * @property {string} free - Free balance
 * @property {string} locked - Locked balance
 */

/**
 * @typedef {Object} Order
 * @property {string} orderId - Order ID
 * @property {string} symbol - Trading pair symbol
 * @property {string} side - Order side (BUY/SELL)
 * @property {string} type - Order type (LIMIT/MARKET)
 * @property {string} price - Order price
 * @property {string} quantity - Order quantity
 * @property {string} executedQty - Executed quantity
 * @property {string} status - Order status
 * @property {number} time - Order timestamp
 */

/**
 * @typedef {Object} OrderResponse
 * @property {string} orderId - Order ID
 * @property {string} symbol - Trading pair symbol
 * @property {string} status - Order status
 * @property {string} type - Order type
 * @property {string} side - Order side
 * @property {string} price - Order price
 * @property {string} quantity - Order quantity
 * @property {string} executedQty - Executed quantity
 * @property {string} cummulativeQuoteQty - Cumulative quote quantity
 * @property {number} time - Order timestamp
 */

/**
 * @typedef {Object} ServiceStatus
 * @property {string} status - Service status
 * @property {string} message - Status message
 * @property {number} timestamp - Current server timestamp
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {number} code - Error code
 * @property {string} message - Error message
 */

/**
 * @typedef {Object} ClientOptions
 * @property {string} [jwt] - JWT authentication token
 * @property {string} [apiKey] - API key for authentication
 * @property {string} [secretKey] - Secret key for API key authentication
 * @property {string} [baseUrl] - Base URL for API requests
 * @property {number} [timeout] - Request timeout in milliseconds
 */

module.exports = {}; 