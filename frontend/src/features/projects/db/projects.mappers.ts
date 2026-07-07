import type { ProjectDTO, ProjectPayloadDTO } from "./project.dtos";
import type { ProjectModel } from "./project.model";

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
  };
};
