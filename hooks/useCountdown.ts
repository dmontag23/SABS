import { useEffect, useState } from "react";

const getCountdownTime = (finalTimeInEpochSeconds: number) =>
  finalTimeInEpochSeconds * 1000 - new Date().getTime();

const useCountdown = (finalTimeInEpochSeconds = 0) => {
  const [msRemaining, setMSRemaining] = useState(
    getCountdownTime(finalTimeInEpochSeconds)
  );

  useEffect(() => {
    const interval = setInterval(
      () => setMSRemaining(getCountdownTime(finalTimeInEpochSeconds)),
      1000
    );

    return () => clearInterval(interval);
  }, [finalTimeInEpochSeconds]);

  return {
    msRemaining,
    countdown: new Date(msRemaining).toISOString().substring(11, 19)
  };
};

export default useCountdown;
