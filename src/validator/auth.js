/* eslint-disable max-len */

const { body } = require("express-validator");
const { sanitizeBodyHelper } = require("./validationHandler");
const { stringField, uuidField } = require("../../utils/commonFunctions");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

exports.registerValidator = [
  sanitizeBodyHelper([
    "firstName",
    "lastName",
    "email",
    "password",
    "roleId",
  ]),

  stringField("firstName", "First Name", false, 2, 50, false, true),

  stringField("lastName", "Last Name", false, 2, 50, false, true),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(passwordRegex)
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character"
    ),

  uuidField("roleId", "Role"),
];


exports.loginValidator = [

  sanitizeBodyHelper([
    "email",
    "password",
  ]),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

];

exports.forgotPasswordValidator = [
  sanitizeBodyHelper(["email"]),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
];
exports.resetPasswordValidator = [

  sanitizeBodyHelper([
    "email",
    "otp",
    "newPassword",
  ]),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .matches(passwordRegex)
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character."
    ),

];