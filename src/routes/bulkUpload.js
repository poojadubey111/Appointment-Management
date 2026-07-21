/* eslint-disable max-len */

const router = require("express").Router();

const { errorWrapper } =
require("../../utils/commonFunctions");

const {

  uploadBulkUsers,

  getBulkUploadHistory,

  downloadBulkUploadFile,

} = require("../controller/bulkUpload");

const checkAuth =
require("../middleware/checkAuth");

const checkPermission =
require("../middleware/checkPermission");

const validateId =
require("../middleware/validateId");

const upload =
require("../middleware/upload");

const {

  uploadBulkUsersValidator,

  getBulkUploadByIdValidator,

} = require("../validator/bulkUpload");

const {

  validationHandler,

} = require("../validator/validationHandler");

router.post(
  "/",
  checkAuth,
  checkPermission,
  upload.single("file"),
  uploadBulkUsersValidator,
  validationHandler,
  errorWrapper(uploadBulkUsers)
);

router.get(
  "/",
  checkAuth,
  checkPermission,
  errorWrapper(getBulkUploadHistory)
);

router.get(
  "/:id/download",
  checkAuth,
  checkPermission,
  validateId,
  errorWrapper(downloadBulkUploadFile)
);

module.exports = router;