import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";

function Timer() {
  const BREAK_RATIO = 0.2;
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Running timer
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);


  const startFocus = () => {
    setSeconds(0);
    setRunning(true);
  }

  const stopTimer = () => {
    setRunning(false);
    setBreakSeconds(seconds * BREAK_RATIO);
    setSeconds(0);
  }

  const startBreak = () => {
    const breakTime = Math.floor(seconds * 0.2);
    setBreakSeconds(breakTime);
    setSeconds(0);
    setRunning(false);
  };

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
        {running ? formatTimer(seconds) : formatTimer(breakSeconds | seconds)}
      </div>
      <div className="flex gap-4 mb-6">
        {!running ? (
          <Button
            onClick={() => startFocus()}
            text="Start"
            variant="danger"
            icon={<i className="bi bi-play-fill" />}
          />
        ) : (
          <Button
            onClick={() => stopTimer()}
            text="Stop"
            variant="secondary"
            icon={<i className="bi bi-x-lg" />}
          />
        )}
      </div>
    </>
  );
}

export default Timer;
