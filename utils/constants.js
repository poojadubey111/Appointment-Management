module.exports.JWT = {
  SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: "1h",
  ALGORITHM: "HS256",
};