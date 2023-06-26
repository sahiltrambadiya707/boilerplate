const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addStaffModule = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    parentId: Joi.string().custom(objectId).allow(null, ''),
    icon: Joi.string().required(),
    route: Joi.string().required(),
    activeOn: Joi.array().items(Joi.string().allow(null, '')).default([]),
    sortOrder: Joi.number().allow(null, '').default(1),
  }),
};

const updateStaffModule = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    parentId: Joi.string().custom(objectId).allow(null, ''),
    icon: Joi.string().required(),
    route: Joi.string().required(),
    activeOn: Joi.array().items(Joi.string().allow(null, '')).default([]),
    sortOrder: Joi.number().allow(null, '').default(1),
  }),
};

const deleteStaffModule = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const getStaffModule = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  addStaffModule,
  updateStaffModule,
  deleteStaffModule,
  getStaffModule,
};
