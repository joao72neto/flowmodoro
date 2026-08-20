import clsx from "clsx";
import { memo, useEffect, useState } from "react";

import { PiCaretDownLight, PiCaretUpLight } from "react-icons/pi";
import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import RatioSlider from "./RatioSlider";
import { PRESETS } from "../../consts/ratio-presets";
import { useTimerContext } from "../../context/timer.context";
import type { RatioPreset } from "../../consts/ratio-presets";
import { useTheme } from "../../../../shared/contexts/theme/theme.context";
import { isNative } from "../../../../consts/platform";
import { useRatio } from "../../hooks/useTimerStore";
import { setRatio } from "../../timer.store";

const RatioSelector = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = useTimerContext();
  const { theme } = useTheme();

  const restRatio = useRatio();
  const isFocusRunning = mode === "focus";

  const currentPreset =
    PRESETS.find((p) => p.value === restRatio) || PRESETS[1];

  useEffect(() => {
    if (isFocusRunning) setIsOpen(false);
  }, [mode, isFocusRunning]);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={isFocusRunning}
        title={
          isFocusRunning ? "Não é possível alterar a razão no modo de foco" : ""
        }
        className={clsx(
          "group flex items-center justify-center transition-all duration-300",
          "h-10 px-4 rounded-xl border border-border bg-neutral-80/60 shadow-lg",
          isFocusRunning
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-neutral-80 hover:border-border",
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span
          className={clsx(
            "font-bold transition-all duration-300",
            isOpen ? "opacity-0 w-0 overflow-hidden" : currentPreset.textClass,
          )}
        >
          {currentPreset.label}
        </span>

        {!isFocusRunning && (
          <>
            {isOpen ? (
              <PiCaretUpLight
                size={24}
                className={clsx("shrink-0 ml-2", isOpen && "ml-0!")}
              />
            ) : (
              <PiCaretDownLight
                size={24}
                className={clsx(
                  "shrink-0 transition-all duration-300",
                  "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100 group-hover:ml-2",
                  isOpen && "ml-0!",
                )}
              />
            )}
          </>
        )}
      </button>

      <AnimatedCollapse
        enableHeavyAnimations={!isNative}
        overflow={theme === "light"}
        show={isOpen && !isFocusRunning}
      >
        <div className="pt-2">
          <RatioSlider
            presets={PRESETS as RatioPreset[]}
            restRatio={restRatio}
            onRatioChange={setRatio}
            currentPreset={currentPreset}
            onPresetChange={setRatio}
          />
        </div>
      </AnimatedCollapse>
    </div>
  );
});

export default RatioSelector;
