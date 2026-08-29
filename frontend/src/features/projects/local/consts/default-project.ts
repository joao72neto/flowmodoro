import type { ProjectModel } from "../project.model";
import { v4 as uuidv4 } from "uuid";

export const DEFAULT_PROJECT: ProjectModel = {
  id: uuidv4(),
  name: "Projeto padrão",
  color: "#3b82f6",
  createdAt: new Date().toISOString(),
};
