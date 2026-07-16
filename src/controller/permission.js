/* eslint-disable max-len */

const {
  createPermission,
  fetchPermissions,
  fetchPermissionById,
  updatePermission,
  deletePermission,
} = require("../service/permission");

const response = require("../../utils/response");

exports.addPermission = async (req, res) => {
  const result = await createPermission(req.body);
  return response.created(res, result);
};

exports.getPermissions = async (req, res) => {
  const result = await fetchPermissions(req.query);
  return response.ok(res, result);
};

exports.getPermissionById = async (req, res) => {
  const { id } = req.params;
  const result = await fetchPermissionById(id);
  return response.ok(res, result);
};

exports.updatePermissionById = async (req, res) => {
  const { id } = req.params;
  const result = await updatePermission(id, req.body);
  return response.ok(res, result);
};

exports.deletePermissionById = async (req, res) => {
  const { id } = req.params;
  const result = await deletePermission(id);
  return response.ok(res, result);
};