module.exports = (app, logger) => {
  // define all route imports here
  const userRoutes = require('./user.route');

  // define all routes here
  app.use(['/api/v1/user'], userRoutes);
};
