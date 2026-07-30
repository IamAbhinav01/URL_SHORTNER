const { validateShortenUrl } = require('./url.middleware');
const errorMiddleware = require('./error.middleware');

module.exports = {
  validateShortenUrl,
  errorMiddleware,
};
