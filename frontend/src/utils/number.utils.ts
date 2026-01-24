export const formatToHour = (minutes: number) => {
  return minutes < 60
    ? `${minutes} min`
    : `${Math.floor(minutes / 60)}h ${Math.floor(minutes % 60)}min`;
};
