const { BIGINT } = require('sequelize');
const { BASE62_ALPHABET } = require('../config/server.config');

const base62_alpha = BASE62_ALPHABET;

const encodeBase62 = (num) => {
  if (num == 0n) return base62_alpha[0];

  let result = '';
  let current = BIGINT(num);
  const base = 62n;
};
