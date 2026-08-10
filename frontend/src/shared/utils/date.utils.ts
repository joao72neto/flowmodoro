export const formatToBRDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();

  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInDays =
    (today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) return "Hoje";
  if (diffInDays === 1) return "Ontem";

  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return `${weekdays[inputDate.getDay()]}, ${String(day).padStart(2, "0")} ${months[month - 1]}`;
};

export const getLocalDateKey = (isoDate: string): string => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(isoDate));
};
