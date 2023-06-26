const express = require('express');
const validate = require('../../middlewares/validate');
const systemModules = require('../../utils/systemModules');
const auth = require('../../middlewares/auth');
const checkPermission = require('../../middlewares/checkPermission');
const roleController = require('../../controllers/role.controller');
const roleValidation = require('../../validations/role.validation');

const router = express.Router();

router.get(
  '/roles',
  auth(),
  checkPermission([{ module: systemModules.ROLE, permission: 'canRead' }]),
  roleController.getRoles
);
router.post(
  '/roles',
  auth(),
  checkPermission([{ module: systemModules.ROLE, permission: 'canAdd' }]),
  validate(roleValidation.addRole),
  roleController.addRole
);
router.put(
  '/roles/:id',
  auth(),
  checkPermission([{ module: systemModules.ROLE, permission: 'canUpdate' }]),
  validate(roleValidation.updateRole),
  roleController.updateRole
);
router.delete(
  '/roles/:id',
  auth(),
  checkPermission([{ module: systemModules.ROLE, permission: 'canDelete' }]),
  validate(roleValidation.deleteRole),
  roleController.deleteRole
);
router.get(
  '/roles/:id',
  auth(),
  checkPermission([{ module: systemModules.ROLE, permission: 'canRead' }]),
  validate(roleValidation.getRole),
  roleController.getRole
);

module.exports = router;
