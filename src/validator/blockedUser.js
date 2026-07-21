/* eslint-disable max-len */

const { body, param } = require("express-validator");
const { sanitizeBodyHelper } = require("./validationHandler");

const allowedFields = [
  "blockedUserId",
];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

exports.blockUserValidator = [
  sanitizeBody,

  body("blockedUserId")
    .notEmpty()
    .withMessage("Blocked user id is required")
    .isUUID()
    .withMessage("Invalid blocked user id"),
];

exports.unblockUserValidator = [
  param("blockedUserId")
    .isUUID()
    .withMessage("Invalid blocked user id"),
];