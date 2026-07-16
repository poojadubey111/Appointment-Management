const {
  createUser,
} = require("../service/user");

const response = require("../../utils/response");

exports.insertUser = async (req, res) => {
  const result = await createUser(req.body);

  return response.created(res, result);
};