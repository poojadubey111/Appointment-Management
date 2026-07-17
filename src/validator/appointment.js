/* eslint-disable max-len */

const { body, param } = require("express-validator");
const { sanitizeBodyHelper } = require("./validationHandler");

const allowedFields = [
  "title",
  "description",
  "startTime",
  "meetingDate",
  "endTime",
  "developerIds", 
//   "addDeveloperIds",
//   "removeDeveloperIds",
];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

const stringField = (field, label, optional = false) => {
  const validator = body(field)
    .isString()
    .withMessage(`${label} must be a string`)
    .trim();

  return optional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.createAppointmentValidator = [
  sanitizeBody,

  stringField("title", "Title"),

  stringField("description", "Description"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Invalid start time"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("Invalid end time"),

  body("developerIds")
    .isArray({ min: 1 })
    .withMessage("Developer list is required"),

  body("developerIds.*")
    .isUUID()
    .withMessage("Invalid developer id"),

    body("meetingDate")
  .notEmpty()
  .withMessage("Meeting date is required")
  .isISO8601()
  .withMessage("Invalid meeting date")
];


exports.getAppointmentByIdValidator = [
  param("id")
    .isUUID()
    .withMessage("Invalid appointment id"),
];



// exports.updateAppointmentValidator = [
//   sanitizeBody,

//   param("id")
//     .isUUID()
//     .withMessage("Invalid appointment id"),

//   stringField("title", "Title", true),

//   stringField("description", "Description", true),

//   body("meetingDate")
//     .optional()
//     .isISO8601()
//     .withMessage("Invalid meeting date"),

//   body("startTime")
//     .optional()
//     .isISO8601()
//     .withMessage("Invalid start time"),

//   body("endTime")
//     .optional()
//     .isISO8601()
//     .withMessage("Invalid end time"),

//   body("status")
//     .optional()
//     .isString(),

//   body("developerIds")
//     .optional()
//     .isArray()
//     .withMessage("Developer list must be array"),

//   body("developerIds.*")
//     .optional()
//     .isUUID()
//     .withMessage("Invalid developer id"),

//   body("addDeveloperIds")
//     .optional()
//     .isArray()
//     .withMessage("Add developer list must be array"),

//   body("addDeveloperIds.*")
//     .optional()
//     .isUUID()
//     .withMessage("Invalid developer id"),

//   body("removeDeveloperIds")
//     .optional()
//     .isArray()
//     .withMessage("Remove developer list must be array"),

//   body("removeDeveloperIds.*")
//     .optional()
//     .isUUID()
//     .withMessage("Invalid developer id"),
// ];