import type { ProjectDTO } from "./dtos/projects-response";
import type { ProjectPayloadDTO } from "./dtos/projects-request";

import type { ProjectModel } from "./local/project.model";

class ProjectMapper {
  toPayload = (project: ProjectModel): ProjectPayloadDTO => ({
    id: project.id,
    name: project.name,
  });

  toPayloadList = (projects: ProjectModel[]): ProjectPayloadDTO[] => {
    return projects.map((project) => this.toPayload(project));
  };

  fromModel = (project: ProjectModel): ProjectDTO => ({
    id: project.id,
    name: project.name,
    totalFocus: 0,
  });

  fromModelList = (projects: ProjectModel[]): ProjectDTO[] => {
    return projects.map((project) => this.fromModel(project));
  };

  fromPayload = (project: ProjectPayloadDTO): ProjectModel => ({
    id: crypto.randomUUID(),
    name: project.name,
    createdAt: new Date().toISOString(),
  });

  fromPayloadList = (projects: ProjectPayloadDTO[]): ProjectModel[] => {
    return projects.map((project) => this.fromPayload(project));
  };
}

export default new ProjectMapper();
