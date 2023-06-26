const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { moduleService } = require('../services');
const { createResponseObject } = require('../utils/utils');

const getStaffModules = catchAsync(async (req, res) => {
  let modules = await moduleService.getStaffModules();

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: 'get successfully',
    payload: { result: modules },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const addStaffModule = catchAsync(async (req, res) => {
  let moduleDoc = await moduleService.addStaffModule(req.body);

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: 'Module added successfully',
    payload: { result: moduleDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const updateStaffModule = catchAsync(async (req, res) => {
  let moduleDoc = await moduleService.updateStaffModule(req.params.id, req.body);

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: 'Module details updated successfully',
    payload: { result: moduleDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const deleteStaffModule = catchAsync(async (req, res) => {
  await moduleService.deleteStaffModule(req.params.id);

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: 'Module deleted successfully',
    payload: {},
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const getStaffModule = catchAsync(async (req, res) => {
  let moduleDoc = await moduleService.getStaffModule(req.params.id);

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: '',
    payload: { result: moduleDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

module.exports = {
  getStaffModules,
  getStaffModule,
  addStaffModule,
  updateStaffModule,
  deleteStaffModule,
};
