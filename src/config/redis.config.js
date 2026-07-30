const { createClient } = require('redis');
const { REDIS_URL } = require('./server.config');

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => console.log('Redis Client Error:', err));
client.on('connect', () => console.log('Connected to Redis Cache'));

client.connect().catch((err) => console.error('Redis Connection Error:', err));

module.exports = { client };

