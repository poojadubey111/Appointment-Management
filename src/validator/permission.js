/* eslint-disable max-len */
const { body, param } = require("express-validator");
const { sanitizeBodyHelper } = require("./validationHandler");

const allowedFields = [
  "actionName",
  "description",
  "method",
  "baseUrl",
  "path",
];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

const stringField = (field, label, isOptional = false) => {
  const validator = body(field)
    .isString()
    .withMessage(`${label} must be a string`)
    .trim();

  return isOptional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.createPermissionValidator = [
  sanitizeBody,

  stringField("actionName", "Action name"),
  stringField("description", "Description", true),
  stringField("baseUrl", "Base URL"),
  stringField("path", "Path"),

  body("method")
    .notEmpty()
    .withMessage("Method is required")
    .isIn(["GET", "POST", "PUT", "PATCH", "DELETE"])
    .withMessage("Invalid HTTP method"),
];

exports.updatePermissionValidator = [
  sanitizeBody,

  param("id")
    .notEmpty()
    .withMessage("Id is required")
    .isUUID()
    .withMessage("Invalid permission id"),

  stringField("actionName", "Action name", true),
  stringField("description", "Description", true),
  stringField("baseUrl", "Base URL", true),
  stringField("path", "Path", true),

  body("method")
    .optional()
    .isIn(["GET", "POST", "PUT", "PATCH", "DELETE"])
    .withMessage("Invalid HTTP method"),
];