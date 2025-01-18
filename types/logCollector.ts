export const logLevels = ["info", "error"] as const;
export type LogLevel = (typeof logLevels)[number];

export type Log = {
  message: string;
  level: LogLevel;
  timestamp: Date;
};

export type LogFunction = (message: string) => void;

export type LogCollector = {
  getAll(): Log[];
} & {
  [K in LogLevel]: LogFunction;
};
