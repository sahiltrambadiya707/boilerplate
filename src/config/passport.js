const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');

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
    const user = await global.models.GLOBAL.USER.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }

    if (user?.local?.token !== req.cookies['token']) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
