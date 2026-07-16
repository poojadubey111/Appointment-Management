/* eslint-disable max-len */

const commonFunctions = require("../../utils/commonFunctions");
const handleSuccess = require("../../utils/successHandler");

const {
  BadRequestError,
  NoDataFoundError,
  InternalServerError,
} = require("../../utils/customError");

exports.createPermission = async (body) => {
  const exists = await commonFunctions.findOne("permission", {
    condition: {
      actionName: body.actionName,
    },
  });

  if (exists) {
    throw new BadRequestError(
      "Permission already exists."
    );
  }

  const permission = await commonFunctions.create(
    "permission",
    body
  );

  if (!permission) {
    throw new InternalServerError(
      "Failed to create permission."
    );
  }

  return handleSuccess(
    "Permission created successfully.",
    permission
  );
};

exports.fetchPermissions = async (query) => {
  const { page, limit, offset } =
    commonFunctions.getPagination(query);

  const result = await commonFunctions.findAll(
    "permission",
    {
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    }
  );

  return handleSuccess(
    "Permissions fetched successfully.",
    commonFunctions.paginatedResponse({
      page,
      limit,
      result,
    })
  );
};

exports.fetchPermissionById = async (id) => {
  const permission =
    await commonFunctions.findByPk(
      "permission",
      id
    );

  if (!permission) {
    throw new NoDataFoundError(
      "Permission not found."
    );
  }

  return handleSuccess(
    "Permission fetched successfully.",
    permission
  );
};

exports.updatePermission = async (
  id,
  body
) => {
  const permission =
    await commonFunctions.findByPk(
      "permission",
      id
    );

  if (!permission) {
    throw new NoDataFoundError(
      "Permission not found."
    );
  }

  if (body.actionName) {
    const exists =
      await commonFunctions.findOne(
        "permission",
        {
          condition: {
            actionName: body.actionName,
          },
        }
      );

    if (
      exists &&
      exists.id !== id
    ) {
      throw new BadRequestError(
        "Permission already exists."
      );
    }
  }

  await commonFunctions.update(
    "permission",
    { id },
    body
  );

  const updated =
    await commonFunctions.findByPk(
      "permission",
      id
    );

  return handleSuccess(
    "Permission updated successfully.",
    updated
  );
};

exports.deletePermission = async (id) => {
  const permission =
    await commonFunctions.findByPk(
      "permission",
      id
    );

  if (!permission) {
    throw new NoDataFoundError(
      "Permission not found."
    );
  }

  await commonFunctions.destroy(
    "permission",
    { id }
  );

  return handleSuccess(
    "Permission deleted successfully."
  );
};