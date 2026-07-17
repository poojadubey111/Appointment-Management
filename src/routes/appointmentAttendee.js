/* eslint-disable max-len */

const router = require("express").Router();

const { errorWrapper } = require("../../utils/commonFunctions");

const {
  respondAppointment
} = require("../controller/appointmentAttendee");

const checkAuth = require("../middleware/checkAuth");
const checkPermission = require("../middleware/checkPermission");
const validateId = require("../middleware/validateId");

const {
respondAppointmentValidator
} = require("../validator/appointmentAttendee");

const {
  validationHandler,
} = require("../validator/validationHandler");

router.patch(
  "/respond/:id",
  checkAuth,
  checkPermission,
  validateId,
  respondAppointmentValidator,
  validationHandler,
  errorWrapper(respondAppointment)
);

module.exports = router;