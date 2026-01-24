import { useState } from "react";
import { useSessionContext } from "../../contexts/SessionContext";

const useCounterComponent = () => {
  const { setFocus, setShowSaveSessionModal } = useSessionContext();

  const BREAK_RATIO = 0.2;
  const [seconds, setSeconds] = useState(0);
  const [mode, setMode] = useState<"focus" | "break" | "stopped" | null>(null);

  const startFocus = () => {
    setSeconds(0);
    setMode("focus");
  };

  const stopFocus = () => {
    setMode("stopped");
    const breakTime = Math.floor(seconds * BREAK_RATIO);
    setSeconds(breakTime);
    setFocus(seconds / 60);
    setShowSaveSessionModal(true);
  };

  const startBreak = () => {
    setMode("break");
  };

  const skipBreak = () => {
    setMode(null);
    setSeconds(0);
  };

  const formatTimer = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (totalSeconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return {
    startFocus,
    stopFocus,
    startBreak,
    skipBreak,
    formatTimer,
    mode,
    setMode,
    seconds,
    setSeconds,
  };
};

export default useCounterComponent;
