import loger from "pino";
import dayjs from "dayjs";
import config from "config";

const level = config.get<string>("loglevel");
const log = loger({
  transport: {
    target: "pino-pretty",
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time": "${dayjs().format()}"`,
});

export default log;
