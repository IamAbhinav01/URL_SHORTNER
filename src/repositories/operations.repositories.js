const { StatusCodes } = require('http-status-codes');
const { ErrorHandler } = require('../errors');
const { loggerConfig } = require('../config');

class Operations {
  constructor(model) {
    this.model = model;
  }

  async create(payload) {
    try {
      const response = await this.model.create(payload);
      loggerConfig.info(
        `Successfully added data to the Database --> repository layer`
      );
      return response;
    } catch (error) {
      loggerConfig.error(
        `error occured while creating data to database ERROR:${error}`
      );
      throw error;
    }
  }

  async getLongUrl(shortcode) {
    try {
      const response = await this.model.findOne({
        where: { shortCode: shortcode },
      });
      loggerConfig.info(
        `Successfully found data from the Database --> repository layer`
      );
      return response;
    } catch (error) {
      loggerConfig.error(
        `error occured while finding data from database:${error}`
      );
      throw error;
    }
  }
}

module.exports = { Operations };
