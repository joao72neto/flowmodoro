import clsx from "clsx";
import { PRESETS } from "../../consts/ratio-presets";

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
        "flex flex-col w-full mx-auto max-w-sm space-y-4 animate-fade-in mb-10",
        "border border-border rounded-2xl py-5 px-6 bg-neutral-80/80 shadow-2xl",
      )}
    >
      <div className="flex justify-between items-start px-1 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="ratio-slider" className="font-bold text-[12px]">
            Perfil de Descanso
          </label>
          <p className="text-[12px] leading-tight text-neutral-20 max-w-[180px]">
            Ajuste o equilíbrio entre foco e recuperação.
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
          <span className="text-[10px] text-neutral-20 font-medium whitespace-nowrap">
            ex: 60m foco = {Math.round(60 * (restRatio / 100))}m pausa
          </span>
        </div>
      </div>

      <div className="relative flex items-center h-6 group px-1">
        <div className="absolute left-0 right-0 h-1.5 sm:h-2 bg-neutral-60 rounded-lg" />

        <div
          className={clsx(
            "absolute left-0 h-2 rounded-lg transition-all duration-300 ease-out",
            currentPreset.bgClass,
          )}
          style={{ width: `${thumbPosition}%` }}
        />

        <div
          className={clsx(
            "absolute w-4 h-4 rounded-full shadow-lg transition-all",
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
                : "text-neutral-20 hover:text-neutral-10",
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
