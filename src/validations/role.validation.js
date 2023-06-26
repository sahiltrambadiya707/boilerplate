const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array()
      .items(
        Joi.object().keys({
          moduleId: Joi.string().custom(objectId).required(),
          canRead: Joi.boolean().default(false),
          canAdd: Joi.boolean().default(false),
          canUpdate: Joi.boolean().default(false),
          canDelete: Joi.boolean().default(false),
          canUpload: Joi.boolean().default(false),
          canDownload: Joi.boolean().default(false),
        })
      )
      .default([]),
  }),
};

const updateRole = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array()
      .items(
        Joi.object().keys({
          moduleId: Joi.string().custom(objectId).required(),
          moduleName: Joi.string().optional(),
          canRead: Joi.boolean().default(false),
          canAdd: Joi.boolean().default(false),
          canUpdate: Joi.boolean().default(false),
          canDelete: Joi.boolean().default(false),
          canUpload: Joi.boolean().default(false),
          canDownload: Joi.boolean().default(false),
        })
      )
      .default([]),
  }),
};

const deleteRole = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const getRole = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  addRole,
  updateRole,
  deleteRole,
  getRole,
};
