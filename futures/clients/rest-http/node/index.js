/**
 * Example usage of the Futures API Client
 */

require('dotenv').config();
const FuturesApiClient = require('./client');

/**
 * Simple example demonstrating how to use the Futures API client
 */
async function runExamples() {
  try {

    // Choose which client to use for the examples
    // You can use either JWT or API Key authentication based on your credentials
    let client;

    // Initialize client with JWT authentication
    if(process.env.JWT_TOKEN) {
        console.log('Initializing client with JWT authentication...');
        if(process.env.JWT_TOKEN)
        client = new FuturesApiClient({
            jwt: process.env.JWT_TOKEN
        });
    }
    else if(process.env.API_KEY && process.env.SECRET_KEY) {
        // Initialize client with API Key authentication
        console.log('Initializing client with API Key authentication...');
        client = new FuturesApiClient({
            apiKey: process.env.API_KEY,
            secretKey: process.env.SECRET_KEY
        });
    }
    else {
        // throw error if credentials are insufficent
        throw new Error('Credentials Insufficient. One of either JWT or Api Key & Secret Key is required');
    }

    // Example 1: Call a public endpoint (no authentication required)
    console.log('\nExample 1: Fetching system status (public endpoint)');
    const status = await client.getSystemStatus();
    console.log('System status:', status);

    // Example 2: Call another public endpoint with parameters
    console.log('\nExample 2: Fetching order book for BTCUSDT (public endpoint)');
    const orderBook = await client.getOrderBook('BTCUSDT');
    console.log('Order book sample:', {
      symbol: orderBook.data?.symbol,
      bidCount: orderBook.data?.bids?.length,
      askCount: orderBook.data?.asks?.length
    });

    // Example 3: Call a private endpoint (requires authentication)
    console.log('\nExample 3: Fetching account balance (private endpoint)');
    const balance = await client.getBalance();
    console.log('Balance:', balance.data);

    // Example 4: Place a market order (private endpoint)
    console.log('\nExample 4: Creating a market order (private endpoint)');
    // Uncomment to execute the order
    /*
    const order = await client.createOrder({
      symbol: 'BTCUSDT',
      amount: 0.002,  // Small amount for testing
      side: 'BUY',
      type: 'MARKET',
      marginAsset: 'USDT'
    });
    console.log('Order created:', order.data);
    */
    console.log('Order creation example (commented out for safety)');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the examples
runExamples().catch(console.error);
