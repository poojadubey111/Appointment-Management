/* eslint-disable */

require("dotenv").config();

const express = require("express");
const logger = require("./utils/logger");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const path = require("path");
const fs = require("fs");

const rateLimit = require("express-rate-limit");

const indexRouter = require("./src/routes");
const requestLogger = require("./src/middleware/requestLogger");

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
app.use(requestLogger);


app.use(express.static(path.join(__dirname, "public")));

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));

app.use("/api", indexRouter);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});



app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    statusCode: err.statusCode || 500,
  });
});

const uploadDir = path.join(__dirname, "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

module.exports = app;