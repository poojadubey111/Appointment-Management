/* eslint-disable max-len */

const router = require("express").Router();

const { errorWrapper } = require("../../utils/commonFunctions");

const {
  addPermission,
  getPermissions,
  getPermissionById,
  updatePermissionById,
  deletePermissionById,
} = require("../controller/permission");

const checkAuth = require("../middleware/checkAuth");
const checkPermission = require("../middleware/checkPermission");
const validateId = require("../middleware/validateId");

const {
  createPermissionValidator,
  updatePermissionValidator,
} = require("../validator/permission");

const {
  validationHandler,
} = require("../validator/validationHandler");

router.post(
  "/",
  checkAuth,
  checkPermission,
  createPermissionValidator,
  validationHandler,
  errorWrapper(addPermission)
);

router.get(
  "/",
  checkAuth,
  checkPermission,
  errorWrapper(getPermissions)
);

router.get(
  "/:id",
  checkAuth,
  checkPermission,
  validateId,
  errorWrapper(getPermissionById)
);

router.put(
  "/:id",
  checkAuth,
  checkPermission,
  validateId,
  updatePermissionValidator,
  validationHandler,
  errorWrapper(updatePermissionById)
);

router.delete(
  "/:id",
  checkAuth,
  checkPermission,
  validateId,
  errorWrapper(deletePermissionById)
);

module.exports = router;