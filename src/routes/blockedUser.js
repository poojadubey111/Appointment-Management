const router = require("express").Router();

const { errorWrapper } = require("../../utils/commonFunctions");

const checkAuth = require("../middleware/checkAuth");

const {
  blockUser,
  fetchBlockedUsers,
  unblockUser,
} = require("../controller/blockedUser");

const {
  blockUserValidator,
  unblockUserValidator,
} = require("../validator/blockedUser");

const {
  validationHandler,
} = require("../validator/validationHandler");

router.post(
  "/",
  checkAuth,
  blockUserValidator,
  validationHandler,
  errorWrapper(blockUser)
);

router.get(
  "/",
  checkAuth,
  errorWrapper(fetchBlockedUsers)
);

router.delete(
  "/:blockedUserId",
  checkAuth,
  unblockUserValidator,
  validationHandler,
  errorWrapper(unblockUser)
);

module.exports = router;