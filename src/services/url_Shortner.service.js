const { loggerConfig } = require('../config/');
const { ErrorHandler } = require('../errors');
const { generateShortCode } = require('../utils/utilitiies');
const { UrlMapping } = require('../models');
const { redisConfig } = require('../config');
const urlmapping = require('../models/urlmapping');
const { where } = require('sequelize');

const CACHE_TTL_SECONDS = 86400;

class UrlShortner {
  static async createShortUrl(orginalUrl) {
    let tries = 0;
    const maxAttempts = 5;
    while (tries < maxAttempts) {
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
        if (error.name === 'SequelizeUniqueConstraintError') {
          tries++;
          continue;
        }
        throw error;
      }
      throw new ErrorHandler(
        'Failed to generate a unique short code after maximum retries'
      );
    }
  }

  static async resolverUrl(shortCode) {
    const cachedUrl = await redisConfig.get(`url:${shortCode}`);
    if (cachedUrl) {
      // ithu redis il check cheyum
      this.incrementClicks(shortCode).catch(console.error);
      return cachedUrl;
    }
    //eni dbyil  nokanam
    const mapping = await urlmapping.findOne({
      where: { shortCode },
    });

    if (!mapping) return null;

    //add to redis
    await redisConfig.client.setEx(
      `url:${shortCode}`,
      CACHE_TTL_SECONDS,
      mapping.orginalUrl
    );
    this.incrementClicks(shortCode).catch(console.error);

    return mapping.orginalUrl;
  }

  static async incrementClicks(shortCode) {
    await urlmapping.increment('clickCount', {
      by: 1,
      where: { shortCode },
    });
  }
}

module.exports = { UrlShortner };
