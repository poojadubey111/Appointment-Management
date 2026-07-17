/* eslint-disable max-len */

const router = require("express").Router();

const { errorWrapper } = require("../../utils/commonFunctions");

const {
  addAppointment,
  getAppointment,
  getAppointmentById,
//   updateAppointmentById,
  deleteAppointmentById,
  respondAppointment
} = require("../controller/appointment");

const checkAuth = require("../middleware/checkAuth");
const checkPermission = require("../middleware/checkPermission");
const validateId = require("../middleware/validateId");

const {
  createAppointmentValidator,
//   updateAppointmentValidator
respondAppointmentValidator,
  getAppointmentByIdValidator
} = require("../validator/appointment");

const {
  validationHandler,
} = require("../validator/validationHandler");

router.post(
  "/",
  checkAuth,
  checkPermission,
  createAppointmentValidator,
  validationHandler,
  errorWrapper(addAppointment)
);

router.get(
  "/",
  checkAuth,
  checkPermission,
  errorWrapper(getAppointment)
);

router.get(
  "/:id",
  checkAuth,
  checkPermission,
  validateId,
  getAppointmentByIdValidator,
  validationHandler,
  errorWrapper(getAppointmentById)
);
router.delete(
  "/:id",
  checkAuth,
  checkPermission,
  validateId,
  errorWrapper(deleteAppointmentById)
);

module.exports = router;