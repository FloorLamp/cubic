import { createLogger, format, transports } from "winston";

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf((info) => {
      return `[${info.timestamp}] ${info.level} ${info.message}${
        info.durationMs ? ` (${info.durationMs}ms)` : ""
      }`;
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
