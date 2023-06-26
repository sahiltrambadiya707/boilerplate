const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const systemModules = require('../../utils/systemModules');
const checkPermission = require('../../middlewares/checkPermission');
const moduleController = require('../../controllers/module.controller');
const moduleValidation = require('../../validations/module.validation');

const router = express.Router();

router.get(
  '/',
  auth(),
  checkPermission([{ module: systemModules.MODULE, permission: 'canRead' }]),
  moduleController.getStaffModules
);
router.post(
  '/',
  auth(),
  checkPermission([{ module: systemModules.MODULE, permission: 'canAdd' }]),
  validate(moduleValidation.addStaffModule),
  moduleController.addStaffModule
);
router.get(
  '/:id',
  auth(),
  checkPermission([{ module: systemModules.MODULE, permission: 'canRead' }]),
  validate(moduleValidation.getStaffModule),
  moduleController.getStaffModule
);
router.put(
  '/:id',
  auth(),
  checkPermission([{ module: systemModules.MODULE, permission: 'canUpdate' }]),
  validate(moduleValidation.updateStaffModule),
  moduleController.updateStaffModule
);
router.delete(
  '/:id',
  auth(),
  checkPermission([{ module: systemModules.MODULE, permission: 'canDelete' }]),
  validate(moduleValidation.deleteStaffModule),
  moduleController.deleteStaffModule
);

module.exports = router;
