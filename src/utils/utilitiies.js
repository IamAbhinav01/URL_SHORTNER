const crypto = require('crypto');
const { BASE62_ALPHABET } = require('../config/server.config');

const encodeBase62 = (num) => {
  if (num === 0n) return BASE62_ALPHABET[0];

  let result = '';
  let current = BigInt(num);

  const base = 62n;

  while (current > 0n) {
    const remainder = Number(current % base);
    result = BASE62_ALPHABET[remainder] + result;
    current = current / base;
  }
  return result;
};

const decodeBase62 = (str) => {
  let result = 0n;
  const base = 62n;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const index = BigInt(BASE62_ALPHABET.indexOf(char));
    if (index === -1n) throw new Error(`Invalid Base62 character: ${char}`);
    result = result * base + index;
  }

  return result;
};

const generateShortCode = (length = 6) => {
  const bytes = crypto.randomBytes(6);
  // Convert 6 random bytes into a 48-bit unsigned BigInt
  const randomNum = BigInt(`0x${bytes.toString('hex')}`);

  let code = encodeBase62(randomNum);

  if (code.length < length) {
    code = code.padStart(length, '0');
  } else if (code.length > length) {
    code = code.slice(0, length);
  }

  return code;
};

module.exports = {
  encodeBase62,
  decodeBase62,
  generateShortCode,
};
