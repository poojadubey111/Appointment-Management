/* eslint-disable max-len */

const {
  query,
} = require("express-validator");

exports.reportValidator = [

  query("fromDate")
    .optional()
    .isISO8601()
    .withMessage(
      "Invalid from date"
    ),

  query("toDate")
    .optional()
    .isISO8601()
    .withMessage(
      "Invalid to date"
    ),

];