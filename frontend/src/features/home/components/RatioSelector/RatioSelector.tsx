import clsx from "clsx";
import { useState } from "react";

import { PiCaretDownLight, PiCaretUpLight } from "react-icons/pi";
import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import RatioSlider from "./RatioSlider";
import { PRESETS } from "../../ratio.const";

function RatioSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [restRatio, setRestRatio] = useState<number>(20);

  const currentPreset =
    PRESETS.find((p) => p.value === restRatio) || PRESETS[1];

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        className={clsx(
          "group flex items-center justify-center cursor-pointer",
          "h-10 px-4 rounded-xl transition-all duration-300",
          "border border-white/10",
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
      </button>

      <AnimatedCollapse show={isOpen}>
        <div className="pt-2">
          <RatioSlider
            presets={PRESETS as any}
            restRatio={restRatio}
            onRatioChange={setRestRatio}
            currentPreset={currentPreset}
            onPresetChange={setRestRatio}
          />
        </div>
      </AnimatedCollapse>
    </div>
  );
}

export default RatioSelector;
