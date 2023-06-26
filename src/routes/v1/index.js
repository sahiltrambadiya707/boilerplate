const httpStatus = require('http-status');
const { createResponseObject } = require('../../utils/utils');
const { errorHandler, errorConverter } = require('../../middlewares/error');

module.exports = (app, logger) => {
  // define all routes here
  const routes = require('./routes');

  app.use(['/api/v1/'], routes);
  app.use(['/api/v1/docs'], require('./docs.route'));

  /* Catch all */
  app.all('*', function (req, res, next) {
    res.status(httpStatus.BAD_REQUEST).json(
      createResponseObject({
        req: req,
        message: 'Sorry! The request could not be processed!',
        payload: {},
        logPayload: false,
      })
    );
  });

  // convert error to ApiError, if needed
  app.use(errorConverter);

  // handle error
  app.use(errorHandler);
};
