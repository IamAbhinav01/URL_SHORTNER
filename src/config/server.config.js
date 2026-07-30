const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  logger_level: process.env.logger_level || 'info',
  BASE62_ALPHABET:
    process.env.BASE62_ALPHABET ||
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};

