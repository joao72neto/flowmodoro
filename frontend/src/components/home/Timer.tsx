import { useEffect, useRef, useState } from "react";
import Button from "../common/btn/Button";

function Timer() {
  const BREAK_RATIO = 0.2;
  const [mode, setMode] = useState<"focus" | "break" | "stopped" | null>(null);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Running timer
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

  const startFocus = () => {
    setSeconds(0);
    setMode("focus");
  };

  const stopFocus = () => {
    setMode("stopped");
    const breakTime = Math.floor(seconds * BREAK_RATIO);
    setSeconds(breakTime);
  };

  const startBreak = () => {
    setMode("break");
  };

  const skipBreak = () => {
    setMode(null);
    setSeconds(0);
  }

  // Formating time
  const formatTimer = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (totalSeconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <>
      <div className="text-6xl font-mono mb-8">
        {mode ? formatTimer(seconds) : "00:00"}
      </div>
      <div className="flex gap-4 mb-6">
        {mode === null ? (
          <Button
            onClick={() => startFocus()}
            text="Start"
            variant="danger"
            icon={<i className="bi bi-play-fill" />}
          />
        ) : mode === "focus" ? (
          <Button
            onClick={() => stopFocus()}
            text="Stop"
            variant="secondary"
            icon={<i className="bi bi-x-lg" />}
          />
        ) : mode === "stopped" ? (
          <Button
            onClick={() => startBreak()}
            text="Break"
            variant="primary"
            icon={<i className="bi bi-play-fill" />}
          />
        ) : (
          <Button
            onClick={() => skipBreak()}
            text="Skip Break"
            variant="secondary"
            icon={<i className="bi bi-skip-end-fill" />}
          />
        )}
      </div>
    </>
  );
}

export default Timer;
