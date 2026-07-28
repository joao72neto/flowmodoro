import type { ProjectDTO } from "./dtos/projects-response";
import type { ProjectPayloadDTO } from "./dtos/projects-request";

import type { ProjectModel } from "./local/project.model";

class ProjectMapper {
  toPayload = (project: ProjectModel): ProjectPayloadDTO => ({
    id: project.id,
    name: project.name,
  });

  fromModel = (project: ProjectModel): ProjectDTO => ({
    id: project.id,
    name: project.name,
    totalFocus: 0,
  });

  fromPayload = (project: ProjectPayloadDTO): ProjectModel => ({
    id: project.id,
    name: project.name,
    createdAt: new Date().toISOString(),
  });

  fromPayloadList = (projects: ProjectPayloadDTO[]): ProjectModel[] =>
    projects.map(this.fromPayload);
}

export default new ProjectMapper();
