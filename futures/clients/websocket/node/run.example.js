require('dotenv').config();

const {
  FuturesPrivateWebSocketClient,
  PRIVATE_EVENTS
} = require('./client');

const authMethod = (process.env.AUTH_METHOD || 'api_key').toLowerCase();
if (!['api_key', 'jwt'].includes(authMethod)) {
  throw new Error('AUTH_METHOD must be "api_key" or "jwt"');
}
const commonOptions = {
  baseUrl: process.env.WEBSOCKET_BASE_URL,
  subaccountId: process.env.SUBACCOUNT_ID || undefined
};

const authOptions = authMethod === 'jwt'
  ? {
      jwt: process.env.JWT_TOKEN,
      clientType: process.env.CLIENT_TYPE || 'api'
    }
  : {
      apiKey: process.env.API_KEY,
      secretKey: process.env.SECRET_KEY
    };

const client = new FuturesPrivateWebSocketClient({
  ...commonOptions,
  ...authOptions
});

client.on('connect', (socketId) => {
  console.log('Socket.IO connected:', socketId);
});
client.on('auth.ok', (details) => {
  console.log('Private stream authenticated:', details);
});
client.on('auth.error', (error) => {
  console.error('Private stream authentication failed:', error);
});
client.on('credential_error', (error) => {
  console.error('Unable to build authentication credentials:', error.message);
});
client.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);
});
client.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

for (const eventName of PRIVATE_EVENTS) {
  client.on(eventName, (payload) => {
    console.log(eventName, payload);
  });
}

process.on('SIGINT', () => {
  client.disconnect();
  process.exit(0);
});

client.connect();
