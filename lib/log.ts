import {
  Log,
  LogCollector,
  logLevels,
  LogFunction,
  LogLevel,
} from "@/types/logCollector";

export function createLogCollector(): LogCollector {
  const logs: Log[] = [];
  const getAll = () => logs;

  const logFunctions = {} as Record<LogLevel, LogFunction>;
  logLevels.forEach(
    (level) =>
      (logFunctions[level] = (message: string) =>
        logs.push({ level, message, timestamp: new Date() }))
  );

  return {
    getAll,
    ...logFunctions,
  };
}
