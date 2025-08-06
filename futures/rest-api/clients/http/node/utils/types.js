/**
 * @module FuturesApiTypes
 * @description Type definitions for Futures API responses
 *
 * This file contains JSDoc type definitions for all API responses
 * to provide better code completion and documentation.
 */

/**
 * Standard API response structure
 * @typedef {Object} ApiResponse
 * @property {string} statusDescription - Human-readable status description
 * @property {*} data - Response data (structure varies by endpoint)
 * @property {number} statusCode - HTTP status code
 * @property {string[]} customMessage - Additional messages
 */

/**
 * MarketSymbol data model representing details for a single trading symbol.
 * Returned within the `symbols` array of MarketsData.
 *
 * @typedef {Object} MarketSymbol
 * @property {string} symbol - The unique trading symbol identifier (e.g., "1000PEPEINR")
 * @property {string} status - Current trading status (e.g., "Open")
 * @property {string} maintMarginPercent - Maintenance margin percentage (as string)
 * @property {string} requiredMarginPercent - Initial margin percentage (as string)
 * @property {string} baseAsset - Base asset code
 * @property {string} quoteAsset - Quote asset code
 * @property {number} pricePrecision - Decimal places for price
 * @property {number} quantityPrecision - Decimal places for quantity
 * @property {number} baseAssetPrecision - Precision for base asset
 * @property {number} quotePrecision - Precision for quote asset
 * @property {string[]} orderTypes - Supported order types (e.g., ["LIMIT", "MARKET"])
 * @property {string[]} timeInForce - Supported time-in-force policies (e.g., ["GTC"])
 * @property {number} makerFee - Maker fee rate
 * @property {number} takerFee - Taker fee rate
 * @property {number} minLeverage - Minimum allowed leverage
 * @property {number} maxLeverage - Maximum allowed leverage
 * @property {Array<Object>} [filters] - Optional: List of trading filters
 */

/**
 * MarketsData data model representing the response structure for fetching all markets.
 * Contained within the `data` field of the ApiResponse from GET /api/v1/market/markets.
 *
 * @typedef {Object} MarketsData
 * @property {string} timezone - Exchange timezone (e.g., "UTC")
 * @property {number} serverTime - Current server time in Unix timestamp (ms)
 * @property {Array<Object>} rateLimits - List of rate limit rules
 * @property {Array<Object>} exchangeFilters - List of global exchange filters
 * @property {MarketSymbol[]} symbols - List of available trading symbols and their details
 */

/**
 * OrderBook data model representing market depth for a trading pair
 *
 * @typedef {Object} OrderBook
 * @property {string} symbol - Trading pair symbol (e.g., "BTCUSDT")
 * @property {Array<[number, number]>} bids - Buy orders as array of [price, amount] pairs, sorted by price in descending order
 * @property {Array<[number, number]>} asks - Sell orders as array of [price, amount] pairs, sorted by price in ascending order
 * @property {number|null} timestamp - Unix timestamp in milliseconds (if available)
 * @property {string|null} datetime - ISO8601 datetime string (if available)
 * @property {number|null} nonce - Exchange-provided sequence number (if available)
 */

/**
 * Ticker data model representing 24-hour market statistics for a trading pair
 *
 * @typedef {Object} Ticker
 * @property {string} symbol - Trading pair symbol
 * @property {Object} info - Raw ticker data from the exchange
 * @property {number} info.eventTimestamp - Event timestamp in milliseconds
 * @property {string} info.symbol - Trading pair symbol
 * @property {string} info.priceChange - Price change in base currency
 * @property {string} info.priceChangePercentage - Price change as a percentage
 * @property {string} info.weightedAveragePrice - Volume-weighted average price
 * @property {string} info.lastPrice - Last traded price
 * @property {string} info.lastQuantityTraded - Last traded quantity
 * @property {string} info.openPrice - Opening price
 * @property {string} info.highestPrice - Highest price in 24h
 * @property {string} info.lowestPrice - Lowest price in 24h
 * @property {string} info.totalTradedVolume - Total volume in base asset
 * @property {string} info.totalTradedQuoteAssetVolume - Total volume in quote asset
 * @property {number} info.startTime - Period start time in milliseconds
 * @property {number} info.endTime - Period end time in milliseconds
 * @property {number} info.firstTradeId - First trade ID in the period
 * @property {number} info.lastTradeId - Last trade ID in the period
 * @property {number} info.numberOfTrades - Total number of trades in the period
 * @property {number} timestamp - Unix timestamp in milliseconds
 * @property {string} datetime - ISO8601 datetime string
 * @property {number} high - Highest price in the period
 * @property {number} low - Lowest price in the period
 * @property {number} vwap - Volume-weighted average price
 * @property {number} open - Opening price
 * @property {number} close - Closing price
 * @property {number} last - Last traded price
 * @property {number} change - Price change in base currency
 * @property {number} percentage - Price change as a percentage
 * @property {number} average - Average price
 * @property {number} baseVolume - Trading volume in base asset
 * @property {number} quoteVolume - Trading volume in quote asset
 * @property {number} bid - Highest current bid price
 * @property {number} bidVolume - Volume available at the highest bid price
 * @property {number} ask - Lowest current ask price
 * @property {number} askVolume - Volume available at the lowest ask price
 */

/**
 * Markets data model representing all available markets
 *
 * @typedef {Object} Markets
 * @property {string} timezone - Exchange timezone
 * @property {number} serverTime - Current server time in milliseconds
 * @property {Array<Object>} rateLimits - Rate limit information for the exchange
 * @property {Array<Object>} exchangeFilters - Global exchange filters
 * @property {Array<Object>} symbols - List of available trading symbols and details
 * @property {string} symbols[].symbol - Trading symbol identifier
 * @property {string} symbols[].status - Current trading status (e.g., "TRADING")
 * @property {string} symbols[].maintMarginPercent - Maintenance margin percentage required
 * @property {string} symbols[].requiredMarginPercent - Required margin percentage
 * @property {string} symbols[].baseAsset - Base asset/cryptocurrency code
 * @property {string} symbols[].quoteAsset - Quote asset/currency code
 * @property {number} symbols[].pricePrecision - Decimal precision for price values
 * @property {number} symbols[].quantityPrecision - Decimal precision for quantity values
 * @property {number} symbols[].baseAssetPrecision - Decimal precision for the base asset
 * @property {number} symbols[].quotePrecision - Decimal precision for the quote asset
 * @property {Array<Object>} symbols[].filters - List of trading filters applied to this symbol
 * @property {string[]} symbols[].orderTypes - Available order types for this symbol
 * @property {string[]} symbols[].timeInForce - Available time-in-force options for this symbol
 */

/**
 * AggregateTrade data model representing combined trades at the same price from the same taker order
 *
 * @typedef {Object} AggregateTrade
 * @property {number} aggregateTradeId - Unique identifier for the aggregate trade
 * @property {string} symbol - Trading pair symbol
 * @property {string} price - Trade price
 * @property {string} quantity - Trade quantity
 * @property {number} firstTradeId - ID of the first trade in the aggregate
 * @property {number} lastTradeId - ID of the last trade in the aggregate
 * @property {number} tradeTime - Timestamp of the trade in milliseconds
 * @property {boolean} isBuyerMarketMaker - Whether the buyer was the market maker
 */

/**
 * WalletBalance data model representing the user's wallet balance
 *
 * @typedef {Object} WalletBalance
 * @property {Object.<string, AssetBalance>} [key] - Map of asset symbols to their balances
 */

/**
 * AssetBalance data model representing the balance for a single asset
 *
 * @typedef {Object} AssetBalance
 * @property {number} total - Total balance of the asset
 * @property {number} free - Available balance that can be used for trading
 * @property {number} used - Frozen balance reserved for open orders
 */

/**
 * Order data model representing a trading order
 *
 * @typedef {Object} Order
 * @property {string} clientOrderId - Client-generated order identifier
 * @property {string} datetime - ISO8601 datetime string of order creation
 * @property {number} timestamp - Unix timestamp in milliseconds of order creation
 * @property {string} symbol - Trading pair symbol
 * @property {string} type - Order type (market, limit, stop_market, etc.)
 * @property {string} timeInForce - Time in force policy (GTC, IOC, FOK)
 * @property {string} side - Order side (buy or sell)
 * @property {number} price - Order price
 * @property {number} amount - Order amount in base asset
 * @property {number} filled - Filled amount in base asset
 * @property {number} remaining - Remaining amount to be filled
 * @property {boolean} reduceOnly - Whether the order is reduce-only
 * @property {boolean} postOnly - Whether the order is post-only
 * @property {string} [status] - Order status (new, filled, canceled, etc.)
 * @property {number} [average] - Average fill price
 * @property {Array<Object>} [trades] - List of trades that filled this order
 * @property {Object} [info] - Raw order data from the exchange
 */

/**
 * Position data model representing a futures trading position
 *
 * @typedef {Object} Position
 * @property {string} id - Unique position identifier
 * @property {string} symbol - Trading pair symbol
 * @property {number} timestamp - Unix timestamp in milliseconds
 * @property {string} datetime - ISO8601 datetime string
 * @property {string} side - Position side (buy or sell)
 * @property {number} contracts - Size of position in contracts
 * @property {number} contractSize - Size of one contract in base asset
 * @property {number} entryPrice - Average entry price
 * @property {number} notional - Notional value of the position
 * @property {number} leverage - Current leverage used
 * @property {number} initialMargin - Initial margin requirement
 * @property {number} liquidationPrice - Estimated liquidation price
 * @property {string} marginMode - Margin mode (isolated or cross)
 * @property {string} [status] - Position status (OPEN, CLOSED, LIQUIDATED) - if applicable
 */

/**
 * Leverage data model representing user leverage settings for a trading pair
 *
 * @typedef {Object} Leverage
 * @property {string} symbol - Trading pair symbol (e.g., 'BTCINR')
 * @property {string} marginMode - Margin mode (isolated or cross)
 * @property {number} longLeverage - Leverage for long positions
 * @property {number} shortLeverage - Leverage for short positions
 * @property {Object} info - Raw leverage data from the exchange
 * @property {string} info.contractName - Trading pair name
 * @property {number} [info.leverage] - Current leverage value (present in get responses)
 * @property {number} [info.updatedLeverage] - New leverage value (present in update responses)
 * @property {number} info.openPositionCount - Number of open positions
 */

/**
 * MarginResponse data model representing response to margin operations
 *
 * @typedef {Object} MarginResponse
 * @property {Object} info - Raw margin operation data
 * @property {number} info.lockedBalance - Updated locked balance
 * @property {number} info.withdrawableBalance - Updated withdrawable balance
 * @property {string} info.asset - Asset/currency code
 * @property {string} info.message - Operation result message
 * @property {string} type - Operation type (add or reduce)
 * @property {number} amount - Operation amount
 * @property {string} code - Asset/currency code
 * @property {string} symbol - Trading pair symbol
 * @property {string} status - Operation status
 */

/**
 * Trade data model representing a completed trade
 *
 * @typedef {Object} Trade
 * @property {string} id - Trade identifier
 * @property {number} timestamp - Unix timestamp in milliseconds
 * @property {string} datetime - ISO8601 datetime string
 * @property {string} symbol - Trading pair symbol
 * @property {string} order - Order identifier
 * @property {string} type - Order type (market, limit, etc.)
 * @property {string} side - Trade side (buy or sell)
 * @property {string} takerOrMaker - Whether the user was taker or maker
 * @property {number} price - Trade price
 * @property {number} amount - Trade amount in base asset
 * @property {number} cost - Trade cost in quote asset
 * @property {Object} fee - Trade fee details
 * @property {number} fee.cost - Fee amount
 * @property {string} fee.currency - Fee currency
 * @property {Object} info - Raw trade data from the exchange
 */

/**
 * Transaction data model representing a wallet transaction
 *
 * @typedef {Object} Transaction
 * @property {string} txid - Transaction identifier
 * @property {number} timestamp - Unix timestamp in milliseconds
 * @property {string} datetime - ISO8601 datetime string
 * @property {string} type - Transaction type (COMMISSION, FUNDING_FEE, etc.)
 * @property {number} amount - Transaction amount
 * @property {string} currency - Transaction currency
 * @property {string} status - Transaction status
 * @property {Object} fee - Transaction fee details
 * @property {string} fee.currency - Fee currency
 * @property {Object} info - Raw transaction data from the exchange
 */

/**
 * ExchangeInfo data model representing exchange configuration
 *
 * @typedef {Object} ExchangeInfo
 * @property {Array<Object>} pairs - Available trading pairs
 * @property {string} pairs[].name - Trading pair name
 * @property {string} pairs[].pair - Trading pair symbol
 * @property {string[]} pairs[].orderTypes - Available order types
 * @property {Array<Object>} pairs[].filters - Trading filters and limits
 * @property {string} pairs[].filters[].filterType - Type of filter (e.g., "LIMIT_QTY_SIZE")
 * @property {string} pairs[].filters[].maxQty - Maximum quantity allowed
 * @property {string} pairs[].filters[].minQty - Minimum quantity allowed
 * @property {number} pairs[].makerFee - Maker fee percentage
 * @property {number} pairs[].takerFee - Taker fee percentage
 * @property {number} pairs[].maxLeverage - Maximum allowed leverage
 * @property {number} pairs[].minLeverage - Minimum allowed leverage
 * @property {string[]} pairs[].depthGrouping - Price grouping for order book
 * @property {string} pairs[].liquidationFee - Liquidation fee percentage
 * @property {string} pairs[].pricePrecision - Decimal precision for price
 * @property {string} pairs[].quantityPrecision - Decimal precision for quantity
 * @property {string} pairs[].maintenanceMarginPercentage - Required maintenance margin percentage
 * @property {string} pairs[].marginBufferPercentage - Additional margin buffer percentage
 * @property {string} pairs[].marginBuffer - Margin buffer as decimal
 * @property {number} pairs[].reduceMarginAllowedRatioPercent - Maximum allowed margin reduction ratio
 * @property {string} pairs[].iconURL - URL to the trading pair icon
 * @property {string} pairs[].baseAsset - Base asset code
 * @property {string} pairs[].quoteAsset - Quote asset code
 * @property {string[]} pairs[].marginAssetsSupported - Supported margin assets
 * @property {number} pairs[].limitPriceVarAllowed - Maximum allowed price variance percentage
 * @property {number} pairs[].fundingFeeInterval - Funding fee interval in hours
 * @property {Array<Object>} quoteCurrencies - Available quote currencies
 * @property {string} quoteCurrencies[].code - Currency code
 * @property {string} quoteCurrencies[].name - Currency name
 * @property {string} quoteCurrencies[].iconDarkTheme - URL to dark theme icon
 * @property {string} quoteCurrencies[].iconLightTheme - URL to light theme icon
 * @property {number} quoteCurrencies[].currencyPrecision - Decimal precision for the currency
 * @property {string[]} categories - Asset categories
 * @property {Object} conversionRates - Currency conversion rates
 * @property {number} conversionRates.INR_MARGIN_USDT - INR to USDT margin conversion rate
 * @property {number} conversionRates.INR_MARGIN_INR - INR to INR margin conversion rate
 * @property {number} conversionRates.INR_SETTLEMENT_USDT - INR to USDT settlement conversion rate
 * @property {number} conversionRates.INR_SETTLEMENT_INR - INR to INR settlement conversion rate
 * @property {number} conversionRates.USDT_SETTLEMENT_USDT - USDT to USDT settlement conversion rate
 * @property {number} conversionRates.USDT_MARGIN_USDT - USDT to USDT margin conversion rate
 */

/**
 * PairsInfo data model representing information about all trading pairs
 *
 * @typedef {Object} PairsInfo
 * @property {Array<Object>} pairs - Available trading pairs
 * @property {string} pairs[].name - Trading pair name (e.g., "Pepe")
 * @property {string} pairs[].pair - Trading pair symbol (e.g., "1000PEPEINR")
 * @property {boolean} pairs[].isActive - Whether the pair is active for trading
 * @property {string} pairs[].iconURL - URL to the trading pair icon
 * @property {string} pairs[].baseAsset - Base asset code (e.g., "1000PEPE")
 * @property {string} pairs[].quoteAsset - Quote asset code (e.g., "INR")
 * @property {string} pairs[].marginAsset - Margin asset code (can be empty)
 * @property {string[]} types - Available transaction types (e.g., "FUNDING_FEE", "COMMISSION")
 * @property {Array<Object>} quoteCurrencies - Available quote currencies
 * @property {string} quoteCurrencies[].code - Currency code (e.g., "INR")
 * @property {string} quoteCurrencies[].name - Currency name (e.g., "Indian Rupee")
 * @property {string} quoteCurrencies[].iconDarkTheme - URL to dark theme icon
 * @property {string} quoteCurrencies[].iconLightTheme - URL to light theme icon
 * @property {number} quoteCurrencies[].currencyPrecision - Decimal precision for the currency
 * @property {string[]} categories - Asset categories (e.g., "AI", "Defi")
 * @property {Object} conversionRates - Currency conversion rates
 * @property {number} conversionRates.INR_MARGIN_USDT - Conversion rate from INR to USDT for margin
 * @property {number} conversionRates.INR_MARGIN_INR - Conversion rate from INR to INR for margin
 * @property {number} conversionRates.INR_SETTLEMENT_USDT - Conversion rate from INR to USDT for settlement
 * @property {number} conversionRates.INR_SETTLEMENT_INR - Conversion rate from INR to INR for settlement
 * @property {number} conversionRates.USDT_SETTLEMENT_USDT - Conversion rate from USDT to USDT for settlement
 * @property {number} conversionRates.USDT_MARGIN_USDT - Conversion rate from USDT to USDT for margin
 */

/**
 * MarketInfo data model representing market information for a trading pair
 *
 * @typedef {Object} MarketInfo
 * @property {string} lastPrice - Last traded price
 * @property {string} marketPrice - Current market price
 * @property {string} priceChangePercent - Price change percentage
 * @property {string} baseAssetVolume - Trading volume in base asset
 */


/**
 * CreateOrderResponse data model representing the response from creating an order
 *
 * @typedef {Object} CreateOrderResponseData
 * @property {string} clientOrderId - Client-generated order identifier
 * @property {string} datetime - ISO8601 datetime string of order creation
 * @property {number} timestamp - Unix timestamp in milliseconds of order creation
 * @property {string} symbol - Trading pair symbol
 * @property {string} type - Order type (market, limit)
 * @property {string} timeInForce - Time in force policy (GTC, IOC, FOK)
 * @property {string} side - Order side (buy or sell)
 * @property {number} price - Order price
 * @property {number} amount - Order amount in base asset
 * @property {number} filled - Filled amount in base asset
 * @property {number} remaining - Remaining amount to be filled
 * @property {boolean} reduceOnly - Whether the order is reduce-only
 * @property {boolean} postOnly - Whether the order is post-only
 */

/**
 * EditOrderResponseData data model representing the response from editing an order
 *
 * @typedef {Object} EditOrderResponseData
 * @property {string} clientOrderId - The client-side ID of the edited order.
 * @property {string} timeInForce - The time-in-force policy (e.g., 'GTC').
 * @property {number} price - The updated price of the order.
 * @property {number} amount - The updated amount of the order.
 * @property {Object} info - An object containing additional details from the exchange.
 * @property {number} info.availableBalance - The available balance.
 * @property {string} info.status - A message confirming the request status.
 * @property {number} info.lockedMargin - The locked margin.
 * @property {number} info.lockedMarginInMarginAsset - The locked margin in the margin asset.
 */

/**
 * Response data model for TP/SL orders
 *
 * @typedef {CreateOrderResponseData} AddTPSLResponseData
 */


/**
 * ClosePositionResponseData data model representing the response from closing a position
 * This is an alias for CreateOrderResponseData since closing a position returns order details
 *
 * @typedef {CreateOrderResponseData} ClosePositionResponseData
 */

/**
 * Canceled Order data model representing a canceled order response
 *
 * @typedef {Object} CancelOrderResponseData
 * @property {string} clientOrderId - Client order identifier
 * @property {string} status - Order status (e.g., "canceled")
 * @property {string} symbol - Trading pair symbol
 * @property {Object} info - Raw order data from the exchange
 * @property {string} info.clientOrderId - Client order identifier
 * @property {number} info.orderId - Exchange order identifier
 * @property {string} info.status - Order status in exchange format
 * @property {boolean} info.success - Indicates if cancellation was successful
 */

/**
 * Paginated response for order listings
 * @typedef {Object} OrdersListResponse
 * @property {Order[]} items - List of orders
 * @property {number} totalCount - Total number of orders matching the query
 * @property {number} nextTimestamp - Timestamp for pagination to fetch next page
 */

/**
 * TradesListResponse data model representing paginated list of trades
 *
 * @typedef {Object} TradesListResponse
 * @property {Trade[]} items - Array of trades
 * @property {number} totalCount - Total number of trades matching the filter criteria
 * @property {number} nextTimestamp - Timestamp to use for the next page request
 */

/**
 * TransactionsListResponse data model representing paginated list of transactions
 *
 * @typedef {Object} TransactionsListResponse
 * @property {Transaction[]} items - Array of transactions
 * @property {number} totalCount - Total number of transactions matching the filter criteria
 * @property {number} nextTimestamp - Timestamp to use for the next page request
 */
