const {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
}  = require("../service/auth");
const response = require("../../utils/response");

exports.register = async (req, res) => {
  const result = await register(req.body);

  return response.created(res, result);
};

exports.login = async (req, res) => {
  const result = await login(req.body);

  return response.ok(res, result);
};

exports.forgotPassword = async (req, res) => {
  const result = await forgotPassword(req.body);

  return response.ok(res, result);
};

exports.resetPassword = async (req, res) => {
  const result = await resetPassword(req.body);

  return response.ok(res, result);
};

exports.logout = async (req, res) => {
  const result = await logout(req.user);

  return response.ok(res, result);
};