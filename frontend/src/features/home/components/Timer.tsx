import { useEffect, useRef } from "react";
import Button from "../../../shared/components/Button";
import useTimer from "../hooks/useTimer";
import clsx from "clsx";

function Timer() {
  const {
    mode,
    seconds,
    setSeconds,
    setMode,
    formatTimer,
    startBreak,
    startFocus,
    stopFocus,
    skipBreak,
  } = useTimer();

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode) {
      intervalRef.current = setInterval(() => {
        if (mode === "focus") {
          setSeconds((prev) => prev + 1);
        } else if (mode === "break") {
          setSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current!);
              intervalRef.current = null;
              setMode(null);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mode, seconds]);

  return (
    <>
      <div
        className={clsx(
          "flex justify-center items-center",
          "text-6xl font-mono mb-12 w-50 h-50 border rounded-full border-white/10 transition-all",
          mode === "focus" &&
            "animate-[border-breathe-focus_2.5s_ease-in-out_infinite] border-red-500!",
          mode === "break" &&
            "animate-[border-breathe-break_2.5s_ease-in-out_infinite] border-green-500!",
        )}
      >
        {mode ? formatTimer(seconds) : "00:00"}
      </div>
      <div className="flex gap-4 mb-6">
        {mode === null ? (
          <Button
            onClick={() => startFocus()}
            variant="danger"
            icon={<i className="bi bi-play-fill" />}
          >
            Start
          </Button>
        ) : mode === "focus" ? (
          <Button
            onClick={() => stopFocus()}
            variant="danger2"
            icon={<i className="bi bi-x-lg" />}
          >
            Stop
          </Button>
        ) : mode === "stopped" ? (
          <Button
            onClick={() => startBreak()}
            variant="success"
            icon={<i className="bi bi-play-fill" />}
          >
            Break
          </Button>
        ) : (
          <Button
            onClick={() => skipBreak()}
            variant="success2"
            icon={<i className="bi bi-skip-end-fill" />}
          >
            Skip Break
          </Button>
        )}
      </div>
    </>
  );
}

export default Timer;
