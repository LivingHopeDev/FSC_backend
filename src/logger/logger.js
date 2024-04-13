import winston from "winston";

const options = {
  file: {
    level: "info",
    filename: "./logs/app.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5mb
    maxfiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

export const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File(options.file),
  ],
  exitOnError: false,
});
