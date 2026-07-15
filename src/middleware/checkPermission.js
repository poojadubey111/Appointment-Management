const db = require("../models");
const response = require("../../utils/response");

module.exports = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;

    if (!roleId) {
      return response.forbidden(res, {
        message: "Role not found",
      });
    }

    const permission = await db.permission.findOne({
      where: {
        baseUrl: req.baseUrl,
        path: req.route.path,
        method: req.method,
      },
    });

    if (!permission) {
      return response.forbidden(res, {
        message: "Permission not found",
      });
    }

    const rolePermission = await db.rolePermission.findOne({
      where: {
        roleId,
        permissionId: permission.id,
      },
    });

    if (!rolePermission) {
      return response.forbidden(res, {
        message: "You don't have permission to access this resource.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};