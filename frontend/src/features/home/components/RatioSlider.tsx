import clsx from "clsx";
import { useState } from "react";

function RatioSlider() {
  const [restRatio, setRestRatio] = useState<number>(20);

  const labelPresets = [
    { value: 30, label: "Leve", color: "text-success" },
    { value: 20, label: "Padrão", color: "text-primary" },
    { value: 10, label: "Intenso", color: "text-danger" },
  ];

  const thumbPreset = [
    { label: "Leve", color: "bg-success" },
    { label: "Padrão", color: "bg-primary" },
    { label: "Intenso", color: "bg-danger" },
  ];

  const currentLabelPreset =
    labelPresets.find((p) => p.value === restRatio) || labelPresets[1];

  const currentThumbPreset =
    thumbPreset.find((p) => p.label === currentLabelPreset.label) ||
    thumbPreset[1];

  const thumbPosition = ((30 - restRatio) / 20) * 100;

  return (
    <div className="flex flex-col w-full mx-auto max-w-md space-y-3 animate-fade-in">
      <div className="flex justify-between items-end px-1">
        <label className="font-bold text-neutral-40">Perfil de Descanso</label>
        <span
          className={clsx(
            "text-sm font-bold transition-all duration-300",
            currentLabelPreset.color,
          )}
        >
          {restRatio}%
        </span>
      </div>

      <div className="relative flex items-center h-6 group px-1">
        <div className="absolute left-1 right-1 h-2 bg-white/10 rounded-lg" />

        <div
          className={clsx(
            "absolute w-4 h-4 rounded-full shadow-md transition-all duration-300 ",
            "ease-out pointer-events-none",
            currentThumbPreset.color,
          )}
          style={{ left: `calc(${thumbPosition}% - 8px)` }}
        />

        <input
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
        {labelPresets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setRestRatio(preset.value)}
            className={clsx(
              "font-bold transition-all duration-200 cursor-pointer",
              "hover:brightness-125 active:scale-95",
              restRatio === preset.value
                ? preset.color
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
