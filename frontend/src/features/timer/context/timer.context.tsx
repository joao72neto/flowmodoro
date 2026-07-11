import { createContext, useContext } from "react";
import useTimer from "../hooks/useTimer";

type TimerContextType = ReturnType<typeof useTimer>;

export const TimerContext = createContext<TimerContextType | null>(null);

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
};
