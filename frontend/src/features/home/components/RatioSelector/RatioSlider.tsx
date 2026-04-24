import clsx from "clsx";
import { PRESETS } from "../../ratio.const";

function RatioSlider({
  presets,
  currentPreset,
  restRatio,
  onRatioChange,
  onPresetChange,
}: {
  presets: typeof PRESETS;
  currentPreset: (typeof PRESETS)[number];
  restRatio: number;
  onRatioChange: (ratio: number) => void;
  onPresetChange: (ratio: number) => void;
}) {
  const thumbPosition = ((restRatio - 10) / 20) * 100;

  return (
    <div
      className={clsx(
        "flex flex-col w-full mx-auto max-w-sm space-y-3 animate-fade-in",
        "border border-white/10 rounded-xl py-4 px-5",
      )}
    >
      <div className="flex justify-between items-end px-1 gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="ratio-slider" className="font-bold text-neutral-40">
            Perfil de Descanso
          </label>
          <p className="text-sm text-neutral-40 break-words max-w-[250px]">
            Ajuste a proporção entre seu esforço e sua recuperação.
          </p>
        </div>
        <div className="flex flex-col items-end text-right">
          <span
            className={clsx(
              "font-bold transition-all duration-300 text-sm sm:text-[16px]",
              currentPreset.textClass,
            )}
          >
            {restRatio}%
          </span>
          <span className="text-[10px] text-neutral-60 font-medium whitespace-nowrap">
            ex: 60m foco = {Math.round(60 * (restRatio / 100))}m pausa
          </span>
        </div>
      </div>

      <div className="relative flex items-center h-6 group px-1">
        <div className="absolute left-0 right-0 h-1.5 sm:h-2 bg-white/10 rounded-lg" />

        <div
          className={clsx(
            "absolute left-0 h-2 rounded-lg transition-all duration-300 ease-out",
            currentPreset.bgClass,
          )}
          style={{ width: `${thumbPosition}%` }}
        />

        <div
          className={clsx(
            "absolute w-4 h-4 rounded-full shadow-lg transition-all ",
            "duration-300 ease-out pointer-events-none z-10",
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
          value={restRatio}
          onChange={(e) => onRatioChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20 m-0"
        />
      </div>

      <div className="flex justify-between px-1">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onPresetChange(preset.value)}
            className={clsx(
              "font-bold transition-all duration-200 cursor-pointer",
              "hover:brightness-125 active:scale-95 text-sm sm:text-[16px]",
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
