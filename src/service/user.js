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