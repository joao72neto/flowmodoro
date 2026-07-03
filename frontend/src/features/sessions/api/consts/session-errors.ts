export type SessionError =
  | "INVALID_SESSION"
  | "SESSION_NOT_FOUND"
  | "INVALID_SESSION_FOCUS";

export const sessionErrors: Record<string, string> = {
  INVALID_SESSION: "Sessão inválida",
  SESSION_NOT_FOUND: "Sessão não encontrada",
  INVALID_SESSION_FOCUS: "Tempo de foco inválido",
};
