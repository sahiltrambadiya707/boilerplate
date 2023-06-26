const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');
const { createResponseObject } = require('../utils/utils');
const messages = require('../../json/messages.json');

const login = catchAsync(async (req, res) => {
  let loginDoc = await authService.login(req, res);

  // const data4responseObject = {
  //   req: req,
  //   code: httpStatus.OK,
  //   message: 'login successfully',
  //   payload: { result: loginDoc },
  //   logPayload: false,
  // };

  // res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  return loginDoc;
});

const logout = catchAsync(async (req, res) => {
  let logoutDoc = await authService.logout(req.body);

  // const data4responseObject = {
  //   req: req,
  //   code: httpStatus.OK,
  //   message: 'logout successfully',
  //   payload: { result: logoutDoc },
  //   logPayload: false,
  // };

  // res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  return logoutDoc;
});

const retrieveAuth0UserData = catchAsync(async (req, res) => {
  let userDataDoc = await authService.retrieveAuth0UserData({
    authId: req.user.authId,
  });

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: messages.DATA_FETCHED,
    payload: { result: userDataDoc },
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

module.exports = {
  login,
  logout,
  retrieveAuth0UserData,
};
