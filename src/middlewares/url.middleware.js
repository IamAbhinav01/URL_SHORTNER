const { StatusCodes } = require('http-status-codes');
const { ErrorHandler } = require('../errors');

const validateShortenUrl = (req, res, next) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return next(
      new ErrorHandler('originalUrl is required in the request body', StatusCodes.BAD_REQUEST)
    );
  }

  // Basic URL validation
  try {
    new URL(originalUrl);
  } catch (err) {
    return next(
      new ErrorHandler('Invalid URL format provided', StatusCodes.BAD_REQUEST)
    );
  }

  next();
};

module.exports = {
  validateShortenUrl,
};
