export const formatToHour = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  if (h > 0) {
    return `${h}h ${m}min ${s}s`;
  }

  if (m > 0) {
    return `${m}min ${s}s`;
  }

  return `${s}s`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

export const formatToPercentage = (value: number) =>
  `${(value * 100).toFixed(0)}%`;
