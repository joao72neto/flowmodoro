export const PROJECT_COLORS = [
  "#ef4444", // Vermelho
  "#22c55e", // Verde
  "#eab308", // Amarelo
  "#3b82f6", // Azul
  "#a855f7", // Roxo
  "#ec4899", // Rosa
  "#f97316", // Laranja
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
];

export const getRandomProjectColor = (): string => {
  const randomIndex = Math.floor(Math.random() * PROJECT_COLORS.length);
  return PROJECT_COLORS[randomIndex];
};

export const getStableProjectColor = (
  id?: string,
  color?: string | null,
): string => {
  if (color && PROJECT_COLORS.includes(color)) {
    return color;
  }
  if (!id) {
    return PROJECT_COLORS[0];
  }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PROJECT_COLORS.length;
  return PROJECT_COLORS[index];
};
