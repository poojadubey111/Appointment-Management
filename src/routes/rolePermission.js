/* eslint-disable max-len */

const router = require("express").Router();

const { errorWrapper } = require("../../utils/commonFunctions");

const {
  insertRolePermission,
  retrieveRolePermissions,
  removeRolePermission,
} = require("../controller/rolePermission");

const checkAuth = require("../middleware/checkAuth");
const checkPermission = require("../middleware/checkPermission");
const validateId = require("../middleware/validateId");

const {
  createRolePermissionValidator,
} = require("../validator/rolePermission");

const {
  validationHandler,
} = require("../validator/validationHandler");

router.post(
  "/",
  checkAuth,
  checkPermission,
  createRolePermissionValidator,
  validationHandler,
  errorWrapper(insertRolePermission)
);

router.get(
  "/",
  checkAuth,
  checkPermission,
  errorWrapper(retrieveRolePermissions)
);

router.delete(
  "/:id",
  checkAuth,
  checkPermission,
  validateId,
  errorWrapper(removeRolePermission)
);

module.exports = router;