const { StatusCodes } = require('http-status-codes');
const { UrlShortner } = require('../services/url_Shortner.service');
const { UrlMapping } = require('../models');
const { ErrorHandler } = require('../errors');
const { serverConfig } = require('../config');

const createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl, ttlDays } = req.body;
    const shortCode = await UrlShortner.createShortUrl(originalUrl, ttlDays);

    const baseUrl = process.env.BASE_URL || `http://localhost:${serverConfig.PORT || 3000}`;
    const shortUrl = `${baseUrl}/${shortCode}`;

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'URL shortened successfully',
      data: {
        shortCode,
        shortUrl,
        originalUrl,
      },
      error: {},
    });
  } catch (error) {
    next(error);
  }
};

const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const originalUrl = await UrlShortner.resolveUrl(shortCode);

    if (!originalUrl) {
      throw new ErrorHandler('Short URL not found or has expired', StatusCodes.NOT_FOUND);
    }

    return res.redirect(StatusCodes.MOVED_TEMPORARILY, originalUrl);
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const mapping = await UrlMapping.findOne({ where: { shortCode } });

    if (!mapping) {
      throw new ErrorHandler('Short URL not found', StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Analytics retrieved successfully',
      data: {
        shortCode: mapping.shortCode,
        originalUrl: mapping.originalUrl,
        clickCount: mapping.clickCount,
        expiresAt: mapping.expiresAt,
        createdAt: mapping.createdAt,
      },
      error: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShortUrl,
  createRestApi: createShortUrl,
  redirectUrl,
  getAnalytics,
};