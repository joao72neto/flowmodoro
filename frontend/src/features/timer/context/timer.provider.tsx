import { TimerContext } from "./timer.context";
import { useMemo } from "react";
import useTimer from "../hooks/useTimer";

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const { startFocus, stopFocus, startBreak, skipBreak, mode } = useTimer();

  const value = useMemo(
    () => ({ startFocus, stopFocus, startBreak, skipBreak, mode }),
    [startFocus, stopFocus, startBreak, skipBreak, mode],
  );

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};
