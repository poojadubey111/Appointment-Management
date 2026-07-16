/* eslint-disable max-len */

const router = require("express").Router();
const checkAuth = require("../middleware/checkAuth");

const { errorWrapper } = require("../../utils/commonFunctions");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout
} = require("../controller/auth");

const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
  
} = require("../validator/auth");

const {
  validationHandler,
} = require("../validator/validationHandler");

router.post(
  "/register",
  registerValidator,
  validationHandler,
  errorWrapper(register)
);

router.post(
  "/login",
  loginValidator,
  validationHandler,
  errorWrapper(login)
);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validationHandler,
  errorWrapper(forgotPassword)
);

router.post(
  "/reset-password",
  resetPasswordValidator,
  validationHandler,
  errorWrapper(resetPassword)
);

router.post(
  "/logout",
  checkAuth,
  errorWrapper(logout)
);
module.exports = router;