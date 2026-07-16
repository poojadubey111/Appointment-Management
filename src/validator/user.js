const { body } = require("express-validator");
const { sanitizeBodyHelper, validationHandler } = require("./validationHandler");
const {
  stringField,
  uuidField,
} = require("../../utils/commonFunctions");

const allowedFields = [
  "firstName",
  "lastName",
  "email",
  "password",
  "roleId",
  "isActive",
];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

exports.createUserValidator = [
  sanitizeBody,

  stringField("firstName", "First name", false, 2, 50, false, true),

  stringField("lastName", "Last name", false, 2, 50, false, true),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character"
    ),

  uuidField("roleId", "Role"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),
];

exports.updateUserValidator = [
  sanitizeBody,

  stringField("firstName", "First name", true, 2, 50, false, true),

  stringField("lastName", "Last name", true, 2, 50, false, true),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .optional()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character"
    ),

  uuidField("roleId", "Role", true),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),
];