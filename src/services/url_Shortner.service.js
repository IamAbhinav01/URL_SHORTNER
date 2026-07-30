const { loggerConfig, redisConfig } = require('../config');
const { ErrorHandler } = require('../errors');
const { generateShortCode } = require('../utils/utilitiies');
const { UrlMapping } = require('../models');
const { StatusCodes } = require('http-status-codes');

const CACHE_TTL_SECONDS = 86400; // 24 hours

class UrlShortner {
  static async createShortUrl(originalUrl, ttlDays = 30) {
    let tries = 0;
    const maxAttempts = 5;
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

    while (tries < maxAttempts) {
      const shortCode = generateShortCode(6);
      try {
        await UrlMapping.create({
          shortCode,
          originalUrl,
          expiresAt,
        });

        await redisConfig.client.setEx(
          `url:${shortCode}`,
          CACHE_TTL_SECONDS,
          originalUrl
        );

        return shortCode;
      } catch (error) {
        loggerConfig.error(`Error while creating shortUrl: ${error.message}`);
        if (error.name === 'SequelizeUniqueConstraintError') {
          tries++;
          continue;
        }
        throw error;
      }
    }

    throw new ErrorHandler(
      'Failed to generate a unique short code after maximum retries',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  static async resolveUrl(shortCode) {
    const cachedUrl = await redisConfig.client.get(`url:${shortCode}`);
    if (cachedUrl) {
      this.incrementClicks(shortCode).catch((err) =>
        loggerConfig.error(`Error incrementing clicks: ${err.message}`)
      );
      return cachedUrl;
    }

    const mapping = await UrlMapping.findOne({
      where: { shortCode },
    });

    if (!mapping) return null;

    // Check expiration
    if (mapping.expiresAt && new Date(mapping.expiresAt) < new Date()) {
      return null;
    }

    // Add to Redis cache
    await redisConfig.client.setEx(
      `url:${shortCode}`,
      CACHE_TTL_SECONDS,
      mapping.originalUrl
    );

    this.incrementClicks(shortCode).catch((err) =>
      loggerConfig.error(`Error incrementing clicks: ${err.message}`)
    );

    return mapping.originalUrl;
  }

  static async incrementClicks(shortCode) {
    await UrlMapping.increment('clickCount', {
      by: 1,
      where: { shortCode },
    });
  }
}

module.exports = { UrlShortner };

