const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('../config');

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: cookieExtractor,
  passReqToCallback: true,
};

const jwtVerify = async (payload, done) => {
  try {
    const admin = await global.models.GLOBAL.ADMIN.findById(payload.sub);

    if (!admin) {
      return done(null, false);
    }

    if (user?.local?.token !== req.cookies['token']) {
      return done(null, false);
    }

    done(null, admin);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
