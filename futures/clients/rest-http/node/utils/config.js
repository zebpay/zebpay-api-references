/**
 * Configuration settings for the futures API client
 */

const config = {
    // Base URL for API requests
    baseUrl: 'https://futuresbe.zebpay.com',

    // API endpoints
    endpoints: {
      // Public endpoints (no authentication required)
      public: {
        market: {
          orderBook: '/api/v1/market/orderBook',
          ticker24Hr: '/api/v1/market/ticker24Hr',
          markets: '/api/v1/market/markets',
          marketInfo: '/api/v1/market/marketInfo',
          aggTrade: '/api/v1/market/aggTrade'
        },
        system: {
          time: '/api/v1/system/time',
          status: '/api/v1/system/status'
        },
        exchange: {
          tradefee: '/api/v1/exchange/tradefee',
          tradefees: '/api/v1/exchange/tradefees',
          exchangeInfo: '/api/v1/exchange/exchangeInfo',
          pairs: '/api/v1/exchange/pairs'
        }
      },

      // Private endpoints (authentication required)
      private: {
        wallet: {
          balance: '/api/v1/wallet/balance'
        },
        trade: {
          order: '/api/v1/trade/order',
          addTPSL: '/api/v1/trade/order/addTPSL',
          addMargin: '/api/v1/trade/addMargin',
          reduceMargin: '/api/v1/trade/reduceMargin',
          closePosition: '/api/v1/trade/position/close',
          openOrders: '/api/v1/trade/order/open-orders',
          positions: '/api/v1/trade/positions',
          userLeverage: '/api/v1/trade/userLeverage',
          userLeverages: '/api/v1/trade/userLeverages',
          updateLeverage: '/api/v1/trade/update/userLeverage',
          orderHistory: '/api/v1/trade/order/history',
          tradeHistory: '/api/v1/trade/history',
          transactionHistory: '/api/v1/trade/transaction/history'
        }
      }
    }
  };

  module.exports = config;
