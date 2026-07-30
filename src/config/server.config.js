const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  logger_level: process.env.logger_level,
  BASE62_ALPHABET: process.env.BASE62_ALPHABET,
  REDIS_URL: process.env.REDIS_URL,
};
