/* eslint-disable max-len */

const router =
require("express").Router();

const {
  errorWrapper,
} =
require("../../utils/commonFunctions");

const {

  exportMeetings,

  getMeetingReport,

} =
require("../controller/report");

const checkAuth =
require("../middleware/checkAuth");

const checkPermission =
require("../middleware/checkPermission");

const {

  reportValidator,

} =
require("../validator/report");

const {

  validationHandler,

} =
require("../validator/validationHandler");

router.get(
  "/meetings/export",
  checkAuth,
  checkPermission,
  reportValidator,
  validationHandler,
  errorWrapper(
    exportMeetings
  )
);

router.get(
  "/meetings",
  checkAuth,
  checkPermission,
  reportValidator,
  validationHandler,
  errorWrapper(
    getMeetingReport
  )
);

module.exports = router;