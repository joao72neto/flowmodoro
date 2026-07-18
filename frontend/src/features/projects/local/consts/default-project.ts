import type { ProjectModel } from "../project.model";

export const DEFAULT_PROJECT: ProjectModel = {
  id: crypto.randomUUID(),
  name: "Projeto padrão",
  createdAt: new Date().toISOString(),
  deleted: false,
  pending_action: null,
};
