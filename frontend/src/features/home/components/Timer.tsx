import { useEffect, useRef } from "react";
import Button from "../../../shared/components/Button";
import useTimer from "../hooks/useTimer";
import clsx from "clsx";

import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { IoPlaySkipForwardCircleSharp } from "react-icons/io5";

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
          "text-6xl font-mono aspect-square p-4 border rounded-full border-white/10",
          "transition-colors transform-gpu",
          mode === "focus" &&
            "animate-[border-breathe-focus_2.5s_ease-in-out_infinite] border-red-500!",
          mode === "break" &&
            "animate-[border-breathe-break_2.5s_ease-in-out_infinite] border-green-500!",
        )}
      >
        {mode ? formatTimer(seconds) : "00:00"}
      </div>
      <div className="flex gap-4">
        {mode === null ? (
          <Button
            onClick={() => startFocus()}
            variant="danger"
            icon={<FaPlayCircle size={20} />}
          >
            Iniciar
          </Button>
        ) : mode === "focus" ? (
          <Button
            onClick={() => stopFocus()}
            variant="danger2"
            icon={<FaStopCircle size={20} />}
          >
            Parar
          </Button>
        ) : mode === "stopped" ? (
          <Button
            onClick={() => startBreak()}
            variant="success"
            icon={<FaPlayCircle size={20} />}
          >
            Iniciar Pausa
          </Button>
        ) : (
          <Button
            onClick={() => skipBreak()}
            variant="success2"
            icon={<IoPlaySkipForwardCircleSharp size={20} />}
          >
            Pular Pausa
          </Button>
        )}
      </div>
    </>
  );
}

export default Timer;
