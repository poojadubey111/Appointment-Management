const {
  createUser,
  fetchUsersForAppointment
} = require("../service/user");

const response = require("../../utils/response");

exports.insertUser = async (req, res) => {
  const result = await createUser(req.body);

  return response.created(res, result);
};

exports.getUsers = async (req, res) => {

    const result =
        await fetchUsersForAppointment(
            req.query
        );

    return response.ok(res, result);
};