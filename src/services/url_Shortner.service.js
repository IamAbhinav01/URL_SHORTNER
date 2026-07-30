const { loggerConfig } = require('../config/');
const { ErrorHandler } = require('../errors');
const { generateShortCode } = require('../utils/utilitiies');
const { UrlMapping } = require('../models');
const { redisConfig } = require('../config');

const CACHE_TTL_SECONDS = 86400;

class UrlShortner {
  static async createShortUrl(orginalUrl) {
    shortCode = generateShortCode(6);
    try {
      await UrlMapping.create({ shortCode, orginalUrl });
      await redisConfig.client.setEx(
        `url:${shortCode}`,
        CACHE_TTL_SECONDS,
        orginalUrl
      );
      return shortCode;
    } catch (error) {
      loggerConfig.error('Error while creating shortUrl');
      throw error;
    }
  }
}
