/* eslint-disable max-len */

const { default: httpStatus } = require("http-status");

module.exports = {

  ok: (res, options = { message: "Request successful" }) => {
    const opts = {
      statusCode: httpStatus.OK,
      success: true,
      ...options,
    };

    return res.status(httpStatus.OK).json(opts);
  },

  created: (res, options = { message: "Resource created successfully" }) => {
    const opts = {
      statusCode: httpStatus.CREATED,
      success: true,
      ...options,
    };

    return res.status(httpStatus.CREATED).json(opts);
  },

  noContent: (res) => {
    return res.status(httpStatus.NO_CONTENT).send();
  },

  badRequest: (res, options = { message: "Bad Request" }) => {
    const opts = {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      ...options,
    };

    return res.status(httpStatus.BAD_REQUEST).json(opts);
  },

  unauthorized: (res, options = { message: "Unauthorized" }) => {
    const opts = {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      ...options,
    };

    return res.status(httpStatus.UNAUTHORIZED).json(opts);
  },

  forbidden: (res, options = { message: "Forbidden" }) => {
    const opts = {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      ...options,
    };

    return res.status(httpStatus.FORBIDDEN).json(opts);
  },

  notFound: (res, options = { message: "Resource not found" }) => {
    const opts = {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      ...options,
    };

    return res.status(httpStatus.NOT_FOUND).json(opts);
  },

  conflict: (res, options = { message: "Resource already exists" }) => {
    const opts = {
      statusCode: httpStatus.CONFLICT,
      success: false,
      ...options,
    };

    return res.status(httpStatus.CONFLICT).json(opts);
  },

  validationError: (
    res,
    options = {
      message: "Validation failed",
      errors: [],
    }
  ) => {
    const opts = {
      statusCode: httpStatus.UNPROCESSABLE_ENTITY,
      success: false,
      ...options,
    };

    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json(opts);
  },

  tooManyRequests: (
    res,
    options = { message: "Too many requests" }
  ) => {
    const opts = {
      statusCode: httpStatus.TOO_MANY_REQUESTS,
      success: false,
      ...options,
    };

    return res.status(httpStatus.TOO_MANY_REQUESTS).json(opts);
  },

  serverError: (
    res,
    options = { message: "Internal server error" }
  ) => {
    const opts = {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      ...options,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(opts);
  },

};