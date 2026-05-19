import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

winston.addColors({
  error: "red bold",
  warn: "yellow bold",
  info: "green",
  debug: "blue",
});

/* const fileFormat = combine(
  timestamp(),
  json()
); */

const consoleFormat = combine(
  timestamp({ format: "HH:mm:ss" }),
  colorize({ level: true }),
  printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
  }),
);

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),

    /* new winston.transports.File({
      filename: "logs/errors/error.log",
      level: "error",
      format: fileFormat
    }) */
  ],
});
export { logger };
