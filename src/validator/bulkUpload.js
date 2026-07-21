/* eslint-disable max-len */

const { param } =
require("express-validator");

exports.uploadBulkUsersValidator = [];

exports.getBulkUploadByIdValidator = [

  param("id")
    .isUUID()
    .withMessage(
      "Invalid bulk upload id"
    ),

];