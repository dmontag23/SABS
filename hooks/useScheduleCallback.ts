import { useCallback, useEffect, useState } from "react";

type RunInfo<T> = {
  callbackArgs: T;
  runAtEpochTimeInSeconds: number;
};

const useScheduleCallback = <T extends any[]>(
  callback: (...args: T) => void
) => {
  const [runInfo, setRunInfo] = useState<RunInfo<T>>();

  const scheduleCallback = useCallback(
    (runAtEpochTimeInSeconds: number, ...args: T) =>
      setRunInfo(
        prevInfo =>
          prevInfo ?? {
            callbackArgs: args,
            runAtEpochTimeInSeconds
          }
      ),
    []
  );

  const cancelScheduledExecution = useCallback(() => setRunInfo(undefined), []);

  useEffect(() => {
    if (runInfo) {
      const timeoutId = setTimeout(
        () => {
          callback(...runInfo.callbackArgs);
          setRunInfo(undefined);
        },
        runInfo.runAtEpochTimeInSeconds * 1000 - new Date().getTime()
      );
      return () => clearTimeout(timeoutId);
    }
  }, [callback, runInfo]);

  return {
    scheduleCallback,
    cancelScheduledExecution,
    isScheduled: Boolean(runInfo)
  };
};

export default useScheduleCallback;
