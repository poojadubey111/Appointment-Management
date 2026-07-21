const {
  createAppointment,
  fetchAppointmentDetails,
  fetchAppointmentById,
  respondAppointment,
  updateAppointmentById,
  deleteAppointmentById,
} = require("../service/appointment");

const response = require("../../utils/response");

exports.addAppointment = async (req, res) => {
  const result = await createAppointment(
    req.body,
    req.user.id
  );

  return response.created(res, result);
};

exports.getAppointment = async (req, res) => {
  const result = await fetchAppointmentDetails(
    req.query,
    req.user
  );

  return response.ok(res, result);
};

exports.getAppointmentById = async (req, res) => {
  const result = await fetchAppointmentById(
    req.params.id
  );

  return response.ok(res, result);
};

exports.deleteAppointmentById = async (req, res) => {
  const result = await deleteAppointmentById(
    req.params.id
  );

  return response.ok(res, result);
};