export type ProjectError = "PROJECT_NOT_FOUND" | "PROJECT_EXISTS";

export const projectErrors: Record<string, string> = {
  PROJECT_NOT_FOUND: "Projeto não encontrado",
  PROJECT_EXISTS: "Projeto já existe",
};
