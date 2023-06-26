const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Get Module By Id
 * @param {ObjectId} id
 * @returns {Promise}
 */
const retrieveGeneralProfileInformation = async (id) => {
  return await global.models.GLOBAL.USER.findById(id);
};

const insertGeneralProfileInformation = async () => {};

const updateGeneralProfileInformation = async () => {};

module.exports = {
  retrieveGeneralProfileInformation,
  insertGeneralProfileInformation,
  updateGeneralProfileInformation,
};
