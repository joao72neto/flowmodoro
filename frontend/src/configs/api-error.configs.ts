import type { ProjectError } from "../features/projects/api/consts/project-errors";
import type { SessionError } from "../features/sessions/api/consts/session-errors";
import type { TagError } from "../features/tags/api/consts/tag-errors";

export type CodeError = ProjectError | TagError | SessionError;

export class ApiError extends Error {
  code?: CodeError;
  statusCode: number;

  constructor(message: string, statusCode: number, code?: CodeError) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const handleApiError = (error: any): never => {
  if (error.response) {
    const data = error.response.data;

    throw new ApiError(
      data?.errors?.[0] || "Erro inesperado no servidor.",
      error.response.status,
      data?.code,
    );
  }

  if (error.request) {
    throw new ApiError("Não foi possível conectar ao servidor.", 503);
  }

  throw new ApiError("Erro interno na aplicação.", 500);
};
