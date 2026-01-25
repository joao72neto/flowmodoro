export const formatToBRDate = (value: string) => {
  const [year, month, day] = value.split("-");

  const d = day.padStart(2, "0");
  const m = month.padStart(2, "0");

  return `${d}/${m}/${year}`;
};
