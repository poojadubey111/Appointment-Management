/* eslint-disable max-len */

const commonFunctions = require("../../utils/commonFunctions");
const handleSuccess = require("../../utils/handleSuccess");

const {
  BadRequestError,
  NoDataFoundError,
  InternalServerError,
} = require("../../utils/customError");

exports.createRolePermission = async (body) => {
  const { roleId, permissionId } = body;

  const exists = await commonFunctions.findOne("rolePermission", {
    condition: {
      roleId,
      permissionId,
    },
  });

  if (exists) {
    throw new BadRequestError(
      "Role permission already exists."
    );
  }

  const rolePermission = await commonFunctions.create(
    "rolePermission",
    {
      roleId,
      permissionId,
    }
  );

  if (!rolePermission) {
    throw new InternalServerError(
      "Failed to create role permission."
    );
  }

  return handleSuccess(
    "Role permission created successfully.",
    rolePermission
  );
};

exports.fetchRolePermissions = async (query) => {
  const { page, limit, offset } =
    commonFunctions.getPagination(query);

  const result = await commonFunctions.findAll(
    "rolePermission",
    {
      limit,
      offset,
      include: [
        {
          association: "role",
          attributes: ["id", "name"],
        },
        {
          association: "permission",
          attributes: [
            "id",
            "baseName",
            "method",
            "url",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    }
  );

  return handleSuccess(
    "Role permissions fetched successfully.",
    commonFunctions.paginatedResponse({
      page,
      limit,
      result,
    })
  );
};

exports.deleteRolePermission = async (id) => {
  const rolePermission =
    await commonFunctions.findByPk(
      "rolePermission",
      id
    );

  if (!rolePermission) {
    throw new NoDataFoundError(
      "Role permission not found."
    );
  }

  await commonFunctions.destroy(
    "rolePermission",
    { id }
  );

  return handleSuccess(
    "Role permission deleted successfully."
  );
};