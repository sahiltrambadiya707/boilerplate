const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Get Module By Id
 * @param {ObjectId} id
 * @returns {Promise}
 */
const getModuleById = async (id) => {
  return global.models.GLOBAL.MODULE.findById(id);
};

/**
 * Get List of Modules For Staff
 */
const getStaffModules = async () => {
  return global.models.GLOBAL.MODULE.find({ isForAdmin: true, isDefault: false }).sort({ createdAt: 'asc' });
};

/**
 * Add Staff Module
 *
 * @param {Object} data
 */
const addStaffModule = async (data) => {
  const { name, icon, route, parentId = null, activeOn = [], sortOrder = 1 } = data;
  let code = data.code.replace(/ /g, '');

  // check if code is already taken or not
  if (await global.models.GLOBAL.MODULE.isCodeExists(code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code is already in use');
  }

  await global.models.GLOBAL.MODULE.create({
    name: name,
    code: code,
    parentId: parentId ? ObjectId(parentId) : null,
    icon: icon,
    route: route,
    activeOn: activeOn,
    sortOrder: sortOrder,
  });
};

/**
 *
 * @param {String} moduleId
 * @param {Object} data
 */
const updateStaffModule = async (moduleId, data) => {
  const { name, icon, route, parentId = null, activeOn = [], sortOrder = 1 } = data;
  let code = data.code.replace(/ /g, '');

  let module = await getModuleById(moduleId);

  if (!module) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Module not found');
  }

  // check if code is already taken or not
  if (await global.models.GLOBAL.MODULE.isCodeExists(code, ObjectId(moduleId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code is already in use');
  }

  module.name = name;
  module.code = code;
  module.icon = icon;
  module.route = route;
  module.parentId = parentId ? ObjectId(parentId) : null;
  module.activeOn = activeOn;
  module.sortOrder = sortOrder;

  await module.save();
};

/**
 * Delete module
 * if not assigned in any permissions
 *
 * @param {String} moduleId
 */
const deleteStaffModule = async (moduleId) => {
  // check if module is assigned into any permission or not
  let permissionsDocCount = await global.models.GLOBAL.PERMISSION.countDocuments({ module: ObjectId(moduleId) });

  if (permissionsDocCount > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The module cannot be removed since it is assigned to Permissions.');
  }

  await global.models.GLOBAL.MODULE.delete({ _id: ObjectId(moduleId) });
};

const getStaffModule = async (moduleId) => {
  let module = await getModuleById(moduleId);

  if (!module) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Module not found');
  }

  return module;
};

module.exports = {
  getStaffModules,
  addStaffModule,
  updateStaffModule,
  deleteStaffModule,
  getStaffModule,
};
