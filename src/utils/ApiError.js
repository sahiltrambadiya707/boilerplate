class ApiError extends Error {
  constructor(statusCode, message, errorDescription, isOperational = true, stack = '') {
    super(message, errorDescription);
    this.message = message;
    this.errorDescription = errorDescription;
    this.custom_errors = message;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
