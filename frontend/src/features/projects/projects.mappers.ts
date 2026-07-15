import type { ProjectDTO } from "./dtos/projects-response";
import type { ProjectPayloadDTO } from "./dtos/projects-request";

import type { ProjectModel } from "./local/project.model";

class ProjectMapper {
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
}

export default new ProjectMapper();
