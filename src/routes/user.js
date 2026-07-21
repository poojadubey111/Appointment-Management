/* eslint-disable max-len */

const router = require("express").Router();

const { errorWrapper } = require("../../utils/commonFunctions");

const {
  insertUser,
  getUsers
} = require("../controller/user");

const checkAuth = require("../middleware/checkAuth");
const checkPermission = require("../middleware/checkPermission");

const {
  createUserValidator,
} = require("../validator/user");

const {
  validationHandler,
} = require("../validator/validationHandler");

router.post(
  "/",
  checkAuth,
  checkPermission,
  createUserValidator,
  validationHandler,
  errorWrapper(insertUser)
);

router.get(
    "/users",
    checkAuth,
    checkPermission,
    errorWrapper(getUsers)
);

module.exports = router;