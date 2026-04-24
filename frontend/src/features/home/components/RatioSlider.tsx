import clsx from "clsx";
import { useState } from "react";

const PRESETS = [
  {
    value: 30,
    label: "Leve",
    textClass: "text-success",
    bgClass: "bg-success",
  },
  {
    value: 20,
    label: "Padrão",
    textClass: "text-primary",
    bgClass: "bg-primary",
  },
  {
    value: 10,
    label: "Intenso",
    textClass: "text-danger",
    bgClass: "bg-danger",
  },
] as const;

function RatioSlider() {
  const [restRatio, setRestRatio] = useState<number>(20);

  const currentPreset =
    PRESETS.find((p) => p.value === restRatio) || PRESETS[1];

  const thumbPosition = ((30 - restRatio) / 20) * 100;

  return (
    <div
      className={clsx(
        "flex flex-col w-full mx-auto max-w-md space-y-3 animate-fade-in border",
        "rounded-xl py-4 px-5 border-white/10",
      )}
    >
      <div className="flex justify-between items-end px-1">
        <label htmlFor="ratio-slider" className="font-bold text-neutral-40">
          Perfil de Descanso
        </label>
        <span
          className={clsx(
            "text-sm font-bold transition-all duration-300",
            currentPreset.textClass,
          )}
        >
          {restRatio}%
        </span>
      </div>

      <div className="relative flex items-center h-6 group px-1">
        <div className="absolute left-1 right-1 h-2 bg-white/10 rounded-lg" />

        <div
          className={clsx(
            "absolute w-4 h-4 rounded-full shadow-md transition-all ",
            "duration-300 ease-out pointer-events-none",
            currentPreset.bgClass,
          )}
          style={{ left: `calc(${thumbPosition}% - 8px)` }}
        />

        <input
          id="ratio-slider"
          type="range"
          min="10"
          max="30"
          step="10"
          value={40 - restRatio}
          onChange={(e) => setRestRatio(40 - Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer m-0"
        />
      </div>

      <div className="flex justify-between px-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => setRestRatio(preset.value)}
            className={clsx(
              "font-bold transition-all duration-200 cursor-pointer",
              "hover:brightness-125 active:scale-95",
              restRatio === preset.value
                ? preset.textClass
                : "text-neutral-60 hover:text-neutral-40",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RatioSlider;
