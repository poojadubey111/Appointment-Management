/* eslint-disable max-len */

const { body } = require("express-validator");

const { sanitizeBodyHelper } = require("./validationHandler");

const { uuidField } = require("../../utils/commonFunctions");

const allowedFields = [
  "roleId",
  "permissionId",
];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

exports.createRolePermissionValidator = [
  sanitizeBody,

  uuidField(
    "roleId",
    "Role"
  ),

  uuidField(
    "permissionId",
    "Permission"
  ),
];