const jwt = require("jsonwebtoken");
const constants = require("./constants");

exports.generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    roleId: user.roleId,
  };

  return jwt.sign(payload, constants.JWT.SECRET, {
    algorithm: constants.JWT.ALGORITHM,
    expiresIn: constants.JWT.EXPIRES_IN,
  });
};

exports.verifyToken = (token) =>
  jwt.verify(token, constants.JWT.SECRET);