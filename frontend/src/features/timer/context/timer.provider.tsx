import { TimerContext } from "./timer.context";
import useTimer from "../hooks/useTimer";

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const timer = useTimer();

  return (
    <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
  );
};
