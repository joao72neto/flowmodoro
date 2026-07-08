const toPaddedString = (value: number) => value.toString().padStart(2, "0");

export const formatToHour = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  if (h > 0) return `${h}h ${m}m`;

  if (m > 0) return `${m}m`;

  if (s > 0) return `${s}s`;
};

export const formatTimer = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  if (h > 0) return `${h}:${toPaddedString(m)}:${toPaddedString(s)}`;

  return `${toPaddedString(m)}:${toPaddedString(s)}`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

export const formatToPercentage = (value: number) =>
  `${(value * 100).toFixed(0)}%`;
