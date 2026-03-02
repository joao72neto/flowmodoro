export const formatToHour = (minutes: number) => {
  return minutes < 60
    ? `${minutes.toFixed(0)} min`
    : `${Math.floor(minutes / 60)}h ${Math.floor(minutes % 60)}min`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

export const formatToPercentage = (value: number) =>
  `${(value * 100).toFixed(0)}%`;
