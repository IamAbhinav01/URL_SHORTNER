const { createClient } = require('redis');
const { REDIS_URL } = require('./server.config');

const client = createClient({ url: REDIS_URL });
client.on('error', (err) => console.log('Redis Client Error', err));
await client.connect();
redis.on('connect', () => console.log('Connected to Redis Cache'));

module.exports = { client };
