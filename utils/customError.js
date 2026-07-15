const httpStatus = require("http-status");

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
    super(message, httpStatus.BAD_REQUEST);
  }
}

class ValidationError extends CustomError {
  constructor(message = "Validation Failed") {
    super(message, httpStatus.UNPROCESSABLE_ENTITY);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, httpStatus.UNAUTHORIZED);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, httpStatus.FORBIDDEN);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, httpStatus.NOT_FOUND);
  }
}

class ConflictError extends CustomError {
  constructor(message = "Resource already exists") {
    super(message, httpStatus.CONFLICT);
  }
}

class TooManyRequestsError extends CustomError {
  constructor(message = "Too many requests") {
    super(message, httpStatus.TOO_MANY_REQUESTS);
  }
}

class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error") {
    super(message, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  CustomError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
  InternalServerError,
};