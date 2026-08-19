export type RatioPreset = {
  value: number;
  label: string;
  textClass: string;
  bgClass: string;
};

export const PRESETS: RatioPreset[] = [
  {
    value: 10,
    label: "Intenso",
    textClass: "text-danger",
    bgClass: "bg-danger",
  },

  {
    value: 20,
    label: "Padrão",
    textClass: "text-primary",
    bgClass: "bg-primary",
  },
  {
    value: 30,
    label: "Leve",
    textClass: "text-success",
    bgClass: "bg-success",
  },
] as const;

export const MAX_BREAK_BY_RATIO = {
  0.1: 600,
  0.2: 900,
  0.3: 1200,
} as const;
