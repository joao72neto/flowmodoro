import { useEffect, useRef } from "react";
import Button from "../../common/Button";
import useCounterComponent from "../../../hooks/components/useCounterComponent";
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
  } = useCounterComponent();

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
          "text-6xl font-mono mb-8 border px-5 py-17 rounded-full border-white/10 transition-all",
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
            variant="secondary"
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
            variant="secondary"
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
