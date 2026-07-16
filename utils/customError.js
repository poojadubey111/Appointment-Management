const { default: httpStatus } = require("http-status");
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NoDataFoundError extends CustomError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

class ValidationError extends CustomError {
  constructor(message = "Validation Error") {
    super(message, httpStatus.UNPROCESSABLE_ENTITY);
  }
}

module.exports = {
  CustomError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NoDataFoundError,
  InternalServerError,
};