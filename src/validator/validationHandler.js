const { validationResult } = require("express-validator");
const _ = require("lodash");
const { ValidationError } = require("../../utils/customError");

exports.validationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ValidationError(
      errors.array().map((err) => err.msg).join(", ")
    );
  }

  next();
};

exports.sanitizeBodyHelper = (allowedFields) => {
  return (req, res, next) => {
    req.body = _.pick(req.body, allowedFields);

    if (Object.keys(req.body).length === 0) {
      throw new ValidationError("Missing valid fields.");
    }

    next();
  };
};