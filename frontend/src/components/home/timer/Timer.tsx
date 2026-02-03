import { useEffect, useRef } from "react";
import Button from "../../common/Button";
import useCounterComponent from "../../../hooks/components/useCounterComponent";

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
      <div className="text-6xl font-mono mb-8">
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
