const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
// router.use("/roles", require("./role"));
router.use("/permissions", require("./permission"));
router.use("/role-permissions", require("./rolePermission"));
router.use("/users", require("./user"));
router.use("/appointments", require("./appointment"));
router.use("/appointmentAttendee", require("./appointmentAttendee"));

module.exports = router;