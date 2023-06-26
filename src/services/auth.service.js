const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const messages = require('../../json/messages.json');
const { generateToken, saveToken, addSecondInCurrentTimeForExpireTime } = require('../utils/auth.util');

const login = async (req, res) => {
  if (!req.query.code) {
    const error = {
      error: 'authorization_code not found',
    };

    // throw new ApiError(httpStatus.PERMANENT_REDIRECT, 'authorization_code not found');
    return res.redirect(301, `${process.env.USER_PANEL_URL}/error/${JSON.stringify(error)}`);
  }

  try {
    const auth0TokenInfo = await auth_code_exchange_with_token(req.query.code);

    const decodeAuth0IdToken = await decode_id_token(auth0TokenInfo?.id_token);

    // const userData = await get_user_from_id_token(decodeAuth0IdToken.sub);

    const refreshToken = await save_token_in_database({ decodeAuth0IdToken, auth0TokenInfo });

    res.cookie('token', refreshToken, {
      httpOnly: true,
      maxAge: 31557600 * 1000,
      secure: true,
    });
    res.cookie('isAuthenticated', true, {
      maxAge: 31557600 * 1000,
    });

    return res.redirect(301, process.env.USER_PANEL_URL);
  } catch (error) {
    return res.redirect(301, `${process.env.USER_PANEL_URL}/error/${error?.message}`);
  }
};

const auth_code_exchange_with_token = async (code) => {
  const options = {
    method: 'POST',
    url: process.env.AUTH0_BASE_URL + '/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code_verifier: process.env.AUTH0_CODE_VERIFIER,
      code: code,
      redirect_uri: process.env.AUTH0_REDIRECT_URL,
    }),
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error(JSON.stringify(error?.response?.data));
  }
};

const decode_id_token = async (idToken) => {
  const idTokenInfo = jwt.decode(idToken);

  if (!idTokenInfo.email) {
    const error = {
      error: 'Email not found',
    };
    throw new Error(JSON.stringify(error));
  }

  return idTokenInfo;
};

const get_user_from_id_token = async (sub) => {
  try {
    const userDoc = await global.models.GLOBAL.AUTH0.findOne({ user_id: sub });

    if (!userDoc) {
      const error = {
        error: 'User not found',
      };
      throw new Error(JSON.stringify(error));
    }

    return userDoc;
  } catch (error) {
    throw new Error(JSON.stringify(error?.response?.data));
  }
};

const revoke_refresh_token = async (token) => {
  const options = {
    method: 'POST',
    url: process.env.AUTH0_BASE_URL + '/oauth/revoke',
    headers: { 'content-type': 'application/json' },
    data: {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      token: token,
    },
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error(JSON.stringify(error?.response?.data));
  }
};

const save_token_in_database = async ({ decodeAuth0IdToken, auth0TokenInfo }) => {
  const authId = decodeAuth0IdToken.sub;
  let tokenDoc = await global.models.GLOBAL.TOKEN.findOne({ auth0Id: authId });

  if (tokenDoc) {
    if (tokenDoc?.auth0?.token) {
      await revoke_refresh_token(tokenDoc.auth0.token);
    }
  }

  const calculatedExpireTime = await addSecondInCurrentTimeForExpireTime(31557600);
  const localToken = await generateToken(authId, calculatedExpireTime);

  const reqData = {
    auth0Id: authId,
    auth0: {
      token: auth0TokenInfo.refresh_token,
      expires: calculatedExpireTime,
      blacklisted: false,
    },
    local: {
      token: localToken,
      expires: calculatedExpireTime,
      blacklisted: false,
    },
  };

  try {
    if (!tokenDoc) {
      await saveToken(reqData);
    } else {
      tokenDoc.auth0 = reqData.auth0;
      tokenDoc.local = reqData.local;
      await tokenDoc.save();
    }
    return localToken;
  } catch (error) {
    throw new Error(JSON.stringify(error?.response?.data));
  }
};

const logout = async (req, res) => {
  try {
    const tokenDoc = await global.models.GLOBAL.TOKEN.findOne({ auth0Id: req.user.auth0Id });
    await revoke_refresh_token(tokenDoc.auth0.token);

    const emptyDoc = {
      token: '',
      expires: 0,
      blacklisted: false,
    };

    tokenDoc.auth0 = emptyDoc;
    tokenDoc.local = emptyDoc;
    await tokenDoc.save();

    res.clearCookie('token');
    res.clearCookie('isAuthenticated');
    res.cookie('isAuthenticated', false);
    return res.status(200).send('logout successfully');
  } catch (error) {
    console.log(error);
    return res.status(400).send('error');
  }
};

const retrieveAuth0UserData = async ({ authId }) => {
  try {
    const auth0UserDoc = await global.models.GLOBAL.AUTH0.findOne(
      { user_id: authId },
      {
        email: 1,
        nickname: 1,
        picture: 1,
      }
    );
    return auth0UserDoc;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.DATA_NOT_RETRIEVED);
  }
};

module.exports = {
  login,
  logout,
  retrieveAuth0UserData,
};
