require('dotenv').config();
const SpotApiClient = require('./client');

async function main() {
  try {
    // Choose which client to use
    // You can use either JWT or API Key authentication based on your credentials
    let client;

    // Initialize client with JWT authentication
    if (process.env.JWT_TOKEN) {
      console.log('Initializing client with JWT authentication...');
      client = new SpotApiClient({
        jwt: process.env.JWT_TOKEN,
        timeout: 20_000 // optional field to configure req timeout - default=30_000 ms
      });
    } else if (process.env.API_KEY && process.env.SECRET_KEY) {
      // Initialize client with API Key authentication
      console.log('Initializing client with API Key authentication...');
      client = new SpotApiClient({
        apiKey: process.env.API_KEY,
        secretKey: process.env.SECRET_KEY,
        timeout: 20_000 // optional field to configure req timeout - default=30_000 ms
      });
    } else {
      // Throw error if credentials are insufficient
      throw new Error('Credentials Insufficient. One of either JWT or API Key & Secret Key is required');
    }

    // System APIs
    // console.log('\n=== System APIs ===');
    // console.log('Fetching system status...');
    // const status = await client.getServiceStatus();
    // console.log('System status:', status);

    // console.log('\nFetching server time...');
    // const serverTime = await client.getServerTime();
    // console.log('Server time:', serverTime);

    // // Market Data APIs
    // console.log('\n=== Market Data APIs ===');
    // console.log('Fetching all tickers...');
    // const allTickers = await client.getAllTickers();
    // console.log('All tickers:', allTickers);

    // console.log('\nFetching BTC-INR ticker...');
    // const ticker = await client.getTicker('BTC-INR');
    // console.log('BTC-INR ticker:', ticker);

    // console.log('\nFetching BTC-INR order book...');
    // const orderBook = await client.getOrderBook('BTC-INR');
    // console.log('BTC-INR order book:', orderBook);

    // console.log('\nFetching BTC-INR order book ticker...');
    // const orderBookTicker = await client.getOrderBookTicker('BTC-INR');
    // console.log('BTC-INR order book ticker:', orderBookTicker);

    // console.log('\nFetching BTC-INR recent trades...');
    // const recentTrades = await client.getRecentTrades('BTC-INR');
    // console.log('BTC-INR recent trades:', recentTrades);

    // console.log('\nFetching BTC-INR kline data...');
    // const kline = await client.getKline('BTC-INR', '1h', Date.now() - 24 * 60 * 60 * 1000, Date.now());
    // console.log('BTC-INR kline data:', kline);

    // // Exchange APIs
    // console.log('\n=== Exchange APIs ===');
    // console.log('Fetching trading pairs...');
    // const tradingPairs = await client.getTradingPairs();
    // console.log('Trading pairs:', tradingPairs);

    // console.log('\nFetching coin settings...');
    // const coinSettings = await client.getCoinSettings();
    // console.log('Coin settings:', coinSettings);

    // Private APIs (require authentication)
    try {
      console.log('\n=== Private APIs ===');
      console.log('Fetching account balance...');
      const balance = await client.getAccountBalance();
      console.log('Account balance:', balance);

      console.log('\nFetching BTC-INR exchange fee...');
      const exchangeFee = await client.getExchangeFee('BTC-INR', 'BUY');
      console.log('BTC-INR exchange fee:', exchangeFee);

      console.log('\nFetching open orders...');
      const openOrders = await client.getOrders('BTC-INR', 'ACTIVE');
      console.log('Open orders:', openOrders);

      console.log('\nFetching filled orders...');
      const filledOrders = await client.getOrders('BTC-INR', 'FILLED');
      console.log('Filled orders:', filledOrders);

      console.log('\nFetching cancelled orders...');
      const cancelledOrders = await client.getOrders('BTC-INR', 'CANCELLED');
      console.log('Cancelled orders:', cancelledOrders);

      // Example: Place a market order (commented out for safety)
      console.log('\nPlacing a market order...');
      const marketOrder = {
        symbol: 'BTC-INR',
        side: 'BUY',
        type: 'MARKET',
        quoteOrderQty: '100'
      };
      const marketOrderResult = await client.placeOrder(marketOrder);
      console.log('Market order placed:', marketOrderResult);

      console.log('\nPlacing a limit order...');
      const limitOrder = {
        symbol: 'BTC-INR',
        side: 'BUY',
        type: 'LIMIT',
        quantity: '0.0001',
        price: '5500000' 
      };
      const limitOrderResult = await client.placeOrder(limitOrder);
      console.log('Limit order placed:', limitOrderResult); 

      // Example: Get order details (commented out as it requires a valid order ID)
      console.log('\nFetching order details...');
      const orderDetails = await client.getOrderDetails('5987589');
      console.log('Order details:', orderDetails);

      // Example: Get order fills (commented out as it requires a valid order ID)
      console.log('\nFetching order fills...');
      const orderFills = await client.getOrderFills('5987589');
      console.log('Order fills:', orderFills);

      // Example: Cancel order (commented out as it requires a valid order ID)
      console.log('\nCanceling order...');
      const cancelResult = await client.cancelOrder('5987589');
      console.log('Cancel result:', cancelResult);

      // Example: Cancel all orders (commented out for safety)
      console.log('\nCanceling all orders...');
      const cancelAllResult = await client.cancelAllOrders('BTC-INR');
      console.log('Cancel all result:', cancelAllResult);

    } catch (error) {
      console.error('Private endpoint error:', error.message);
      console.log('This is likely due to insufficient credentials. Please check your .env file.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main(); 