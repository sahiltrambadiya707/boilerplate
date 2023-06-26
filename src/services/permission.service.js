const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Get authorized admin list for given module identifier
 *
 * @param {String} data[moduleIdentifier]
 * @param {Object} data[requiredPermissions]
 */
const getAuthorizedAdminListForModule = async (data) => {
  const { moduleIdentifier, requiredPermissions = {}, includeStaff } = data;
  let roleIds;

  if (includeStaff) {
    // getting module details from identifier
    const moduleDoc = await global.models.GLOBAL.MODULE.findOne({ code: moduleIdentifier });

    if (!moduleDoc) {
      return {
        status: false,
        error: {
          message: 'Module not found',
        },
      };
    }

    // getting roles which are having permission to access the given module
    const roleDocs = await global.models.GLOBAL.PERMISSION.aggregate([
      {
        $match: {
          module: ObjectId(moduleDoc._id),
          deleted: {
            $ne: true,
          },
          ...requiredPermissions,
        },
      },
      {
        $group: {
          _id: '$role',
        },
      },
    ]);

    roleIds = roleDocs.map((role) => {
      return role._id;
    });
  }

  let filterQuery = {
    $or: [
      {
        isStaff: {
          $ne: true,
        },
      },
    ],
  };

  if (includeStaff) {
    filterQuery.$or.push({
      role: {
        $in: roleIds,
      },
    });
  }

  // getting list of admin staff which are above roles or user is admin
  const adminDocs = await global.models.GLOBAL.ADMIN.aggregate([
    {
      $match: filterQuery,
    },
  ]);

  return adminDocs;
};

module.exports = {
  getAuthorizedAdminListForModule,
};
