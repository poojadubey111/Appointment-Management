/* eslint-disable max-len */

const commonFunctions = require("../../utils/commonFunctions");
const handleSuccess = require("../../utils/successHandler");

const {
  BadRequestError,
  InternalServerError,
} = require("../../utils/customError");

exports.createUser = async (body) => {

  const existingUser = await commonFunctions.findOne("user", {
    condition: {
      email: body.email,
    },
  });

  if (existingUser) {
    throw new BadRequestError("Email already exists.");
  }

  const user = await commonFunctions.create(
    "user",
    body
  );

  if (!user) {
    throw new InternalServerError(
      "Unable to create user."
    );
  }

  return handleSuccess(
    "User created successfully.",
    user
  );
};


exports.fetchUsersForAppointment = async (query) => {

    const {
        page,
        limit,
        offset,
    } = commonFunctions.getPagination(query);

    const where = commonFunctions.buildQueryFilters(
        query,
        [],
        [
            "firstName",
            "lastName",
            "email",
        ]
    );

    where.role = "developer";
    where.isActive = true;

    const users = await commonFunctions.findAll(
        "user",
        {
            condition: where,
            attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
            ],
            limit,
            offset,
            order: commonFunctions.buildSort(
                query,
                [
                    "firstName",
                    "lastName",
                    "createdAt",
                ]
            ),
        }
    );

    return handleSuccess(
        "Developers fetched successfully.",
        commonFunctions.paginatedResponse({
            page,
            limit,
            result: users,
        })
    );
};