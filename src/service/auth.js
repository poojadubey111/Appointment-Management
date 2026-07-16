/* eslint-disable max-len */
const jwt = require("jsonwebtoken");
const redisClient = require("../../config/redis");
const commonFunctions = require("../../utils/commonFunctions");
const handleSuccess = require("../../utils/successHandler");

const {
  BadRequestError,
  InternalServerError,
} = require("../../utils/customError");

exports.register = async (body) => {

  const existingUser = await commonFunctions.findOne(
    "user",
    {
      condition: {
        email: body.email,
      },
    }
  );

  if (existingUser) {
    throw new BadRequestError(
      "Email already exists."
    );
  }

  // Check role exists

  const role = await commonFunctions.findByPk(
    "role",
    body.roleId
  );

  if (!role) {
    throw new BadRequestError(
      "Invalid role."
    );
  }

  const user = await commonFunctions.create(
    "user",
    {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      roleId: body.roleId,
    }
  );

  if (!user) {
    throw new InternalServerError(
      "Failed to register user."
    );
  }

  return handleSuccess(
    "User registered successfully.",
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId,
    }
  );
};

exports.login = async (body) => {

  const user = await commonFunctions.findOne(
    "user",
    {
      condition: {
        email: body.email,
      },
      include: [
        {
          association: "role",
        },
      ],
    }
  );

  if (!user) {
    throw new BadRequestError("Invalid email or password.");
  }

  const isMatch = await user.comparePassword(
    body.password
  );

  if (!isMatch) {
    throw new UnauthorizedError(
      "Invalid email or password."
    );
  }

  if (!user.isActive) {
    throw new UnauthorizedError(
      "User account is inactive."
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      roleId: user.roleId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  await redisClient.set(
    `session:${user.id}`,
    token,
    {
      EX: 60 * 60 * 24,
    }
  );

  return handleSuccess(
    "Login successful.",
    {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
      },
    }
  );
};

exports.forgotPassword = async (body) => {

  const user = await commonFunctions.findOne(
    "user",
    {
      condition: {
        email: body.email,
      },
    }
  );

  if (!user) {
    throw new BadRequestError(
      "User not found."
    );
  }

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  await redisClient.set(
    `forgot-password:${body.email}`,
    otp,
    {
      EX: 300,
    }
  );

  return handleSuccess(
    "OTP sent successfully.",
    {
      email: body.email,
      otp,
    }
  );
};

exports.resetPassword = async (body) => {

  const user = await commonFunctions.findOne(
    "user",
    {
      condition: {
        email: body.email,
      },
    }
  );

  if (!user) {
    throw new BadRequestError(
      "User not found."
    );
  }

  const savedOtp = await redisClient.get(
    `forgot-password:${body.email}`
  );

  if (!savedOtp) {
    throw new BadRequestError(
      "OTP expired."
    );
  }

  if (savedOtp !== body.otp) {
    throw new BadRequestError(
      "Invalid OTP."
    );
  }

  await commonFunctions.update(
    "user",
    {
      id: user.id,
    },
    {
      password: body.newPassword,
    }
  );

  await redisClient.del(
    `forgot-password:${body.email}`
  );

  return handleSuccess(
    "Password reset successfully."
  );
};

exports.logout = async (user) => {

  await redisClient.del(`session:${user.id}`);

  return handleSuccess(
    "Logout successful."
  );
};