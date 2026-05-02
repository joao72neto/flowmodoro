import Button from "../../../../shared/components/Button";
import { useTimerContext } from "../../timer.context";
import clsx from "clsx";

import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { IoPlaySkipForwardCircleSharp } from "react-icons/io5";

import { useSessionContext } from "../../../session/session.context";

function Timer() {
  const {
    mode,
    seconds,
    formatTimer,
    startBreak,
    startFocus,
    stopFocus,
    skipBreak,
  } = useTimerContext();

  const { restRatio } = useSessionContext();

  return (
    <>
      <div
        className={clsx(
          "flex justify-center items-center",
          "text-6xl font-mono aspect-square p-7 border rounded-full border-white/10",
          "transition-colors transform-gpu",
          mode === "focus" &&
            "animate-[sonar-focus_2.5s_ease-in-out_infinite] border-danger!",
          mode === "break" &&
            "animate-[sonar-break_2.5s_ease-in-out_infinite] border-success!",
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
            disabled={seconds * (restRatio / 100) < 1}
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
