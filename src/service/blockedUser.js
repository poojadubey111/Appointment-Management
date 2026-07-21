/* eslint-disable max-len */

const commonFunctions = require("../../utils/commonFunctions");
const handleSuccess = require("../../utils/successHandler");

const {
  BadRequestError,
  NoDataFoundError,
} = require("../../utils/customError");

exports.blockUser = async (
  userId,
  body
) => {

  if (userId === body.blockedUserId) {
    throw new BadRequestError(
      "You cannot block yourself."
    );
  }

  const user = await commonFunctions.findByPk(
    "user",
    body.blockedUserId
  );

  if (!user) {
    throw new NoDataFoundError(
      "User not found."
    );
  }

  const blocked = await commonFunctions.findOne(
    "blockedUser",
    {
      condition: {
        userId,
        blockedUserId: body.blockedUserId,
      },
    }
  );

  if (blocked) {
    throw new BadRequestError(
      "User already blocked."
    );
  }

  await commonFunctions.create(
    "blockedUser",
    {
      userId,
      blockedUserId: body.blockedUserId,
    }
  );

  return handleSuccess(
    "User blocked successfully."
  );
};

exports.fetchBlockedUsers = async (
  userId
) => {

  const blockedUsers =
    await commonFunctions.findAllWithoutPagination(
      "blockedUser",
      {
        condition: {
          userId,
        },
        include: [
          {
            association: "blockedUserDetails",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
            ],
          },
        ],
      }
    );

  return handleSuccess(
    "Blocked users fetched successfully.",
    blockedUsers
  );
};

exports.unblockUser = async (
  userId,
  blockedUserId
) => {

  const blocked =
    await commonFunctions.findOne(
      "blockedUser",
      {
        condition: {
          userId,
          blockedUserId,
        },
      }
    );

  if (!blocked) {
    throw new NoDataFoundError(
      "Blocked user not found."
    );
  }

  await blocked.destroy();

  return handleSuccess(
    "User unblocked successfully."
  );
};