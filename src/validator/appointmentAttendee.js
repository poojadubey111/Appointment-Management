/* eslint-disable max-len */

const { body, param } = require("express-validator");
const { sanitizeBodyHelper } = require("./validationHandler");
const { appointmentResponseStatus } = require("../../utils/enums");

const allowedFields = [
  "status",
];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

exports.respondAppointmentValidator = [
  sanitizeBody,

  param("id")
    .isUUID()
    .withMessage("Invalid appointment attendee id"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      appointmentResponseStatus.ACCEPTED,
      appointmentResponseStatus.DECLINED,
    ])
    .withMessage("Status must be accepted or declined"),
];