export const formatToBRDate = (value: string) => {
  const [year, month, day] = value.split("-");

  const d = day.padStart(2, "0");
  const m = month.padStart(2, "0");

  const newDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (newDate.getDate() === new Date().getDate()) return "Hoje";
  if (newDate.getDate() === new Date().getDate() - 1) return "Ontem";

  return `${d}/${m}/${year}`;
};
