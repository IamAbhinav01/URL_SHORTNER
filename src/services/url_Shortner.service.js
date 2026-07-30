const { loggerConfig } = require('../config/');
const { ErrorHandler } = require('../errors');

class UrlShortner {
  static async createShortUrl(orginalUrl) {
    try {
    } catch (error) {
      loggerConfig.error('Error while creating shortUrl');
      throw ErrorHandler(
        'Failed to generate a unique short code after maximum retries'
      );
    }
  }
}
