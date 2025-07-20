import { consoleTransport, logger } from "react-native-logs";

export const log = logger.createLogger({
  dateFormat: "iso",
  transport: [consoleTransport],
  transportOptions: {
    colors: {
      debug: "cyanBright",
      info: "magentaBright",
      warn: "yellowBright",
      error: "redBright"
    }
  }
});
