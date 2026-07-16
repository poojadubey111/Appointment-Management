/* eslint-disable */

require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");

const rateLimit = require("express-rate-limit");

const indexRouter = require("./src/routes");

const { CustomError } = require("./utils/customError");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

// app.use(limiter);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

app.get("/", (req, res) => {
  res.send("Appointment Management API");
});

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    statusCode,
  });
});

const uploadDir = path.join(__dirname, "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

module.exports = app;