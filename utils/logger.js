const path = require("path");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),

  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: path.join(
        process.cwd(),
        "logs/combined.log"
      ),
    }),

    new winston.transports.File({
      filename: path.join(
        process.cwd(),
        "logs/error.log"
      ),
      level: "error",
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(
        process.cwd(),
        "logs/exceptions.log"
      ),
    }),
  ],
});

module.exports = logger;