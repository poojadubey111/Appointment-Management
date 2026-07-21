const {
  blockUser,
  fetchBlockedUsers,
  unblockUser,
} = require("../service/blockedUser");

exports.blockUser = async (req, res) => {

  const response = await blockUser(
    req.user.id,
    req.body
  );

  return res.status(201).json(response);
};

exports.fetchBlockedUsers = async (req, res) => {

  const response = await fetchBlockedUsers(
    req.user.id
  );

  return res.status(200).json(response);
};

exports.unblockUser = async (req, res) => {

  const response = await unblockUser(
    req.user.id,
    req.params.blockedUserId
  );

  return res.status(200).json(response);
};