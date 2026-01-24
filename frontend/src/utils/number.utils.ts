export const formatToHour = (minutes: number) => {
  return minutes < 60
    ? `${minutes.toFixed(0)} min`
    : `${Math.floor(minutes / 60)}h ${Math.floor(minutes % 60)}min`;
};
