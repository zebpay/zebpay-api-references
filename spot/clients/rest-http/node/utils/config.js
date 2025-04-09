/**
 * Configuration settings for the spot API client
 */

const config = {
  // Base URL for API requests
  baseUrl: 'https://www.zebstage.com',

  // API endpoints
  endpoints: {
    // Public endpoints (no authentication required)
    public: {
      market: {
        allTickers: '/api/v2/market/allTickers',
        kline: '/api/v2/market/klines',
        orderBook: '/api/v2/market/orderbook',
        orderBookTicker: '/api/v2/market/orderbook/ticker',
        ticker: '/api/v2/market/ticker',
        trades: '/api/v2/market/trades'
      },
      system: {
        status: '/api/v2/status',
        time: '/api/v2/time'
      },
      exchange: {
        currencies: '/api/v2/ex/currencies',
        tradepairs: '/api/v2/ex/tradepairs'
      }
    },

    // Private endpoints (authentication required)
    private: {
      account: {
        balance: '/api/v2/account/balance'
      },
      trade: {
        orders: '/api/v2/ex/orders',
        orderDetails: '/api/v2/ex/orders',
        orderFills: '/api/v2/ex/orders/fills',
        fee: '/api/v2/ex/fee',
      }
    }
  }
};

module.exports = config; 