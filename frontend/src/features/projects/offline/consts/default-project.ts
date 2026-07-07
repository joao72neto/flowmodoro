import type { ProjectModel } from "../project.model";

export const DEFAULT_PROJECT: ProjectModel = {
  id: crypto.randomUUID(),
  name: "Projeto padrão",
};
