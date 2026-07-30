const { StatusCodes } = require('http-status-codes');
const { loggerConfig } = require('../config');

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statuscode || err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  loggerConfig.error(`[Error Middleware] ${statusCode} - ${message}`);

  return res.status(statusCode).json({
    success: false,
    message: message,
    data: {},
    error: {
      explanation: err.info || message,
      statusCode: statusCode,
    },
  });
};

module.exports = errorMiddleware;
