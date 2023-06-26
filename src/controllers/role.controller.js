const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');
const { createResponseObject } = require('../utils/utils');

const getRoles = catchAsync(async (req, res) => {
  let roles = await roleService.getRoles(req.query);

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: 'get successfully',
    payload: { result: roles },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const addRole = catchAsync(async (req, res) => {
  let roleDoc = await roleService.addRole(req.body);

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: 'Role added successfully',
    payload: { result: roleDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const updateRole = catchAsync(async (req, res) => {
  let roleDoc = await roleService.updateRole(req.params.id, req.body);

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: 'Role details updated successfully',
    payload: { result: roleDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const deleteRole = catchAsync(async (req, res) => {
  await roleService.deleteRole(req.params.id);

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: 'Role deleted successfully',
    payload: {},
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const getRole = catchAsync(async (req, res) => {
  let roleDoc = await roleService.getRoleDetails(req.params.id);

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: '',
    payload: { result: roleDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

module.exports = {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  getRole,
};
