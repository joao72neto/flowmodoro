import type { ProjectDTO } from "./dtos/projects-response";
import type { ProjectPayloadDTO } from "./dtos/projects-request";

import type { ProjectModel } from "./local/project.model";

export const modelToDTOArray = (projects: ProjectModel[]): ProjectDTO[] => {
  return projects.map((project) => modelToDTO(project));
};

export const modelToDTO = (project: ProjectModel): ProjectDTO => {
  return {
    id: project.id,
    name: project.name,
    totalFocus: 0,
  };
};

export const payloadToModel = (project: ProjectPayloadDTO): ProjectModel => {
  return {
    id: crypto.randomUUID(),
    name: project.name,
    createdAt: new Date().toISOString(),
  };
};
