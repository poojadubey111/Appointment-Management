const response = require("../../utils/response");

const {
  createRolePermission,
  fetchRolePermissions,
  deleteRolePermission,
} = require("../service/rolePermission");

exports.insertRolePermission = async (req, res) => {
  const result = await createRolePermission(req.body);
  return response.created(res, result);
};

exports.retrieveRolePermissions = async (req, res) => {
  const result = await fetchRolePermissions(req.query);
  return response.ok(res, result);
};

exports.removeRolePermission = async (req, res) => {
  const result = await deleteRolePermission(req.params.id);
  return response.ok(res, result);
};