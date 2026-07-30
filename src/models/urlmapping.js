'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UrlMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UrlMapping.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      shortCode: { type: DataTypes.STRING, allowNull: false },
      originalUrl: { type: DataTypes.TEXT, allowNull: false },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      clickCount: { type: DataTypes.BIGINT, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'UrlMapping',
    }
  );
  return UrlMapping;
};
