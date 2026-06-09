import Button from "../../../../shared/components/buttons/Button";
import { useTimerContext } from "../../timer.context";
import clsx from "clsx";

import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { IoPlaySkipForwardCircleSharp } from "react-icons/io5";

import { formatTimer } from "../../../../shared/utils/number.utils";
import { useSessionContext } from "../../../sessions/sessions.context";

function Timer() {
  const { mode, seconds, startBreak, startFocus, stopFocus, skipBreak } =
    useTimerContext();

  const { restRatio } = useSessionContext();

  return (
    <>
      <div
        className={clsx(
          "flex justify-center items-center bg-neutral-80/80",
          "font-mono aspect-square p-7 border rounded-full border-border shadow-2xl",
          "transition-all duration-500 transform-gpu",
          mode === "focus" && [
            "animate-[sonar-focus_3s_ease-in-out_infinite] border-danger/50 shadow-danger/20",
            "text-danger drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]",
          ],
          mode === "break" && [
            "animate-[sonar-break_3s_ease-in-out_infinite] border-success/50 shadow-success/20",
            "text-success drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]",
          ],
          seconds >= 3600 ? "text-5xl" : "text-6xl",
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
