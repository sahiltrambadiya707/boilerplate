const mongoose = require('mongoose');
const httpStatus = require('http-status');
const configuration = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { createResponseObject } = require('../utils/utils');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, '', false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message, errorDescription = '' } = err;
  if (configuration.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  if (configuration.env === 'development') {
    logger.error(err);
  }

  logger.error(`${req.originalUrl} - Error caught by error-handler (router.js): ${err.message}\n${err.stack}`);

  const data4responseObject = {
    req: req,
    code: statusCode,
    message: message,
    payload: {
      error: errorDescription,
    },
    logPayload: false,
  };

  res.status(statusCode).send(createResponseObject(data4responseObject));
};

module.exports = {
  errorConverter,
  errorHandler,
};
