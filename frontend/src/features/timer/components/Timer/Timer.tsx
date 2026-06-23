import { useTimerContext } from "../../timer.context";
import clsx from "clsx";

import { formatTimer } from "../../../../shared/utils/number.utils";

function Timer() {
  const { mode, seconds } = useTimerContext();

  return (
    <div
      className={clsx(
        "flex justify-center items-center bg-neutral-80/80",
        "font-mono aspect-square p-7 border rounded-full border-border shadow-2xl",
        "transition-all duration-500 transform-gpu",
        mode === "focus" && [
          "animate-[sonar-focus_3s_ease-in-out_infinite] border-primary/50 shadow-primary/20",
          "text-neutral-20 drop-shadow-[0_0_20px_rgba(245,158,11,0.35)]",
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
  );
}

export default Timer;
