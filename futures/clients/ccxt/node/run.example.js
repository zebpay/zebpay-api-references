const ccxt = require('ccxt');
require('dotenv').config(); // For loading API keys securely

const exchangeId = 'zebpayfutures'; // Exchange ID for CCXT
const exchangeClass = ccxt[exchangeId];

const client = new exchangeClass({
  apiKey: process.env.API_KEY,
  secret: process.env.SECRET_KEY, // zebpay apiKey and secret
});

(async () => {
  try {
    const status = await client.fetchStatus(); // Fetch exchange status
    console.log(`${client.name} Status:`, status);

    const balance = await client.fetchBalance();
    console.log(`${client.name} Balance:`, balance)
  } catch (e) {
    console.error(`Error: ${e.constructor.name} - ${e.message}`);
  }
})();
