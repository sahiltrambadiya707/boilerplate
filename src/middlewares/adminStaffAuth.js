const passport = require('passport');
const { jwtStrategy } = require('../config/admin/passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallback = (req, resolve, reject) => async (err, admin, info) => {
  if (err || info || !admin) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please Authenticate'));
  }

  if (!admin.isActive) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Your Account is Disabled'));
  }

  req.admin = admin;

  resolve();
};

const adminStaffAuth = () => async (req, res, next) => {
  passport.use('jwt', jwtStrategy);

  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = adminStaffAuth;
