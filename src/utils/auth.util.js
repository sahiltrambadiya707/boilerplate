const moment = require('moment');
const jwt = require('jsonwebtoken');
const axios = require('axios').default;

const generateToken = async (userId, expires, secret = process.env.JWT_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires,
  };
  return jwt.sign(payload, secret);
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const tokenDoc = await global.models.GLOBAL.TOKEN.findOne({ token, type, user: payload.sub, blacklisted: false });

  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

const saveToken = async (data) => {
  const tokenDoc = await global.models.GLOBAL.TOKEN.create(data);
  return tokenDoc;
};

const checkTokenIsExpire = async (ExpireTime) => {
  return Number(ExpireTime) < Date.now() / 1000;
};

const addSecondInCurrentTimeForExpireTime = (second) => {
  return moment().unix() + second;
};

const get_access_token = async (user) => {
  const options = {
    method: 'POST',
    url: process.env.AUTH0_BASE_URL + '/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.AUTH0_CLIENT_ID,
      refresh_token: user.auth0.token,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
    }),
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error(JSON.stringify(error?.response?.data));
  }
};

module.exports = {
  saveToken,
  verifyToken,
  generateToken,
  checkTokenIsExpire,
  get_access_token,
  addSecondInCurrentTimeForExpireTime,
};
