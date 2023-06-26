const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { createResponseObject } = require('../utils/utils');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

// const auth =
//   (...requiredRights) =>
//   async (req, res, next) => {
//     return new Promise((resolve, reject) => {
//       passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
//     })
//       .then(() => next())
//       .catch((err) => next(err));
//   };

const auth = () => async (req, res, next) => {
  const token = req.cookies['token'];
  if (token) {
    try {
      jwt.verify(token, config.jwt.secret);
    } catch (error) {
      const data4responseObject = {
        req: req,
        code: httpStatus.UNAUTHORIZED,
        message: 'Authorization required',
        payload: {},
        logPayload: false,
      };
      return res.status(httpStatus.UNAUTHORIZED).json(createResponseObject(data4responseObject));
    }

    const user = await global.models.GLOBAL.TOKEN.findOne({ auth0Id: payload.sub });

    if (!user) {
      const data4responseObject = {
        req: req,
        code: httpStatus.UNAUTHORIZED,
        message: 'Authorization required',
        payload: {},
        logPayload: false,
      };

      return res.status(httpStatus.UNAUTHORIZED).json(createResponseObject(data4responseObject));
    }

    req.user = {
      auth0Id: user.auth0Id,
    };
    next();
  } else {
    const data4responseObject = {
      req: req,
      code: httpStatus.UNAUTHORIZED,
      message: 'Authorization required',
      payload: {},
      logPayload: false,
    };

    return res.status(httpStatus.UNAUTHORIZED).json(createResponseObject(data4responseObject));
  }
};

module.exports = auth;
