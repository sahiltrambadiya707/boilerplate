const ObjectId = require('mongoose').Types.ObjectId;
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * Create Role
 *
 * @param {Object} data
 * @returns {Object}
 */
const addRole = async (data) => {
  let { name, permissions = [] } = data;

  let roleDoc = await global.models.GLOBAL.ROLE.create({
    name: name,
  });

  let permissionsDocs = [];

  for (let i = 0; i < permissions.length; i++) {
    let permission = permissions[i];

    permissionsDocs.push({
      role: ObjectId(roleDoc.id),
      module: ObjectId(permission.moduleId),
      canRead: permission.canRead,
      canAdd: permission.canAdd,
      canUpdate: permission.canUpdate,
      canDelete: permission.canDelete,
      canUpload: permission.canUpload,
      canDownload: permission.canDownload,
    });
  }

  if (permissionsDocs.length > 0) {
    await global.models.GLOBAL.PERMISSION.insertMany(permissionsDocs);
  }

  return roleDoc;
};

/**
 * Update Role
 *
 * @param {ObjectId} roleId
 * @param {Object} data
 * @returns {Object}
 */
const updateRole = async (roleId, data) => {
  let { name, permissions = [] } = data;

  let roleDoc = await global.models.GLOBAL.ROLE.findOne({ _id: ObjectId(roleId) });

  if (!roleDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role not found');
  }

  // updating permissions for role
  for (let i = 0; i < permissions.length; i++) {
    let permission = permissions[i];

    await global.models.GLOBAL.PERMISSION.updateOne(
      {
        role: ObjectId(roleDoc.id),
        module: ObjectId(permission.moduleId),
      },
      {
        role: ObjectId(roleDoc.id),
        module: ObjectId(permission.moduleId),
        canRead: permission.canRead,
        canAdd: permission.canAdd,
        canUpdate: permission.canUpdate,
        canDelete: permission.canDelete,
        canUpload: permission.canUpload,
        canDownload: permission.canDownload,
      },
      {
        upsert: true,
      }
    );
  }

  roleDoc.name = name;

  await roleDoc.save();

  return roleDoc;
};

/**
 * Get List of Roles
 *
 * @param {Object} query
 * @param {Boolean} includeDisabled - include disabled roles in the roles list
 */
const getRoles = async (query, includeDisabled = true) => {
  let { pagination = 'false', filter, rowsPerPage, page, descending, sortBy } = query;

  if (pagination == 'false') {
    let filterQuery = {};

    if (!includeDisabled) {
      filterQuery.isActive = true;
    }

    return global.models.GLOBAL.ROLE.find(filterQuery).sort({ createdAt: 'asc' });
  }

  let filtersQuery = {};

  if (!includeDisabled) {
    filtersQuery.isActive = true;
  }

  if (filter) {
    let search = filter;

    filtersQuery = Object.assign(filtersQuery, {
      $or: [{ name: { $regex: search, $options: 'i' } }],
    });
  }

  let recordsPerPage = rowsPerPage == '0' ? '9999999999' : rowsPerPage;
  let currentPage = page ? page : '1';

  const options = {};

  options.sortBy = `${sortBy && sortBy !== '' ? sortBy : 'createdAt'}:${descending == 'true' ? 'desc' : 'asc'}`;
  options.limit = recordsPerPage;
  options.page = currentPage;

  return global.models.GLOBAL.ROLE.paginate(filtersQuery, options);
};

/**
 * Delete Role
 * delete role if not assigned to any staff member
 *
 * @param {ObjectId} roleId
 */
const deleteRole = async (roleId) => {
  await global.models.GLOBAL.ROLE.delete({ _id: ObjectId(roleId) });
};

const getRoleDetails = async (roleId) => {
  let roleDoc = await global.models.GLOBAL.ROLE.findOne({ _id: ObjectId(roleId) });

  if (!roleDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role not found');
  }

  let permissions = await global.models.GLOBAL.MODULE.aggregate([
    // only including required information
    {
      $project: {
        _id: 1,
        isForAdmin: 1,
        name: 1,
      },
    },
    // filter modules that are only for staff
    {
      $match: {
        isForAdmin: true,
      },
    },
    // fetch the module details from permission
    {
      $lookup: {
        from: 'permissions',
        let: {
          module_id: '$_id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$module', '$$module_id'],
              },
              role: ObjectId(roleId),
            },
          },
        ],
        as: 'permission',
      },
    },
    {
      $unwind: {
        path: '$permission',
        preserveNullAndEmptyArrays: true,
      },
    },
    // projecting required details
    {
      $project: {
        _id: 0,
        moduleId: '$_id',
        moduleName: '$name',
        canAdd: {
          $ifNull: ['$permission.canAdd', false],
        },
        canRead: {
          $ifNull: ['$permission.canRead', false],
        },
        canUpdate: {
          $ifNull: ['$permission.canUpdate', false],
        },
        canDelete: {
          $ifNull: ['$permission.canDelete', false],
        },
        canUpload: {
          $ifNull: ['$permission.canUpload', false],
        },
        canDownload: {
          $ifNull: ['$permission.canDownload', false],
        },
      },
    },
  ]);

  return {
    role: roleDoc,
    permissions: permissions,
  };
};

module.exports = {
  addRole,
  updateRole,
  getRoles,
  deleteRole,
  getRoleDetails,
};
