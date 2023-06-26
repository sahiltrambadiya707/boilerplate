const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key', wrap: { label: false } }, stripUnknown: false, abortEarly: false })
    .messages({
      'string.empty': '{#label} is required',
    })
    .validate(object);

  if (error) {
    const { details } = error;

    let error_data = {};

    /**
     * Create Object of Errors
     *
     * e.g. { email: "email is required" }
     */
    details.filter((item) => {
      error_data[item.context.key] = item.message;
    });

    return next(new ApiError(httpStatus.BAD_REQUEST, 'validation error', error_data));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
