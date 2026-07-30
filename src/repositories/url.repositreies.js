const CrudRepository = require('./operations.repositories');
const { UrlMapping } = require('../models');
const { loggerConfig } = require('../config');

class UrlRepository extends CrudRepository {
  constructor() {
    super(UrlMapping);
  }
}

module.exports = { UrlRepository };
