const {
  respondAppointment,
} = require("../service/appointmentAttendee");

const response = require("../../utils/response");
exports.respondAppointment = async (req, res) => {

  const response = await respondAppointment(
    req.params.id,
    req.body,
    req.user.id
  );

  return res.status(200).json(response);
};