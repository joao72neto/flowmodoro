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

  fromDTO = (dto: ProjectDTO): ProjectModel => ({
    id: dto.id,
    name: dto.name,
    createdAt: dto.updatedAt || new Date().toISOString(),
    updatedAt: dto.updatedAt,
    deletedAt: dto.deletedAt,
  });

  fromDTOList = (dtos: ProjectDTO[]): ProjectModel[] =>
    dtos.map(this.fromDTO);
}

export default new ProjectMapper();
