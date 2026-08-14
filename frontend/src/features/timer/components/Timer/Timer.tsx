import { useTimerContext } from "../../context/timer.context";
import clsx from "clsx";

import { formatTimer } from "../../../../shared/utils/number.utils";
import { useSeconds } from "../../hooks/useTimerStore";

const TimerDigits = ({
  mode,
}: {
  mode: "focus" | "break" | "stopped" | null;
}) => {
  const seconds = useSeconds();

  return (
    <div className={clsx(seconds > 3600 ? "text-5xl" : "text-6xl")}>
      {mode ? formatTimer(seconds) : "00:00"}
    </div>
  );
};

const Timer = () => {
  const { mode } = useTimerContext();
  const isRunning = mode !== null && mode !== "stopped";

  const modeConfig = {
    focus: {
      label: "Foco",
      badge: "🎯",
      ring: "border-primary/40",
      pulseRing: "border-primary/50 animate-sonar-pulse",
      text: "text-primary",
      glow: "drop-shadow-[0_0_20px_rgba(245,158,11,0.35)]",
    },
    break: {
      label: "Pausa",
      badge: "☕",
      ring: "border-success/40",
      pulseRing: "border-success/50 animate-sonar-pulse",
      text: "text-success",
      glow: "drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]",
    },
    stopped: {
      label: "",
      badge: "",
      ring: "border-border",
      pulseRing: "",
      text: "text-neutral-20",
      glow: "",
    },
  } as const;

  const config = mode ? modeConfig[mode] : modeConfig.stopped;

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div
        className={clsx(
          "relative flex items-center justify-center",
          "aspect-square min-w-60 p-7 rounded-full shadow-2xl",
          "bg-neutral-80/80 font-mono font-semibold",
          config.ring,
          isRunning ? "border-2" : "border",
        )}
      >
        {isRunning && (
          <>
            <div
              className={clsx(
                "absolute inset-0 rounded-full border-4 pointer-events-none",
                config.pulseRing,
              )}
              aria-hidden="true"
            />
            <div
              className={clsx(
                "absolute top-6 flex items-center gap-1",
                "text-xs font-medium px-2 py-1 rounded-full",
                "bg-neutral-80/40 border border-border",
                config.text,
              )}
            >
              <span>{config.badge}</span>
              <span>{config.label}</span>
            </div>
          </>
        )}
        <div className={clsx(config.glow, config.text)}>
          <TimerDigits mode={mode} />
        </div>
      </div>
    </div>
  );
};

export default Timer;
