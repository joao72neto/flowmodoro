import { db } from "../../../indexedDB";
import type { ProjectDTO, ProjectPayloadDTO } from "./project.dtos";
import type { ProjectModel } from "./project.model";
import {
  modelToDTO,
  modelToDTOArray,
  payloadToModel,
} from "./projects.mappers";
import { applyUpdates } from "./utils/apply-updates";

export const fetchLocalProjects = async (): Promise<ProjectDTO[]> => {
  const projects = await db.projects.toArray();
  return modelToDTOArray(projects);
};

export const createLocalProject = async (
  payload: ProjectPayloadDTO,
): Promise<ProjectDTO> => {
  const project: ProjectModel = payloadToModel(payload);

  await db.projects.add(project);

  return modelToDTO(project);
};

export const updateLocalProject = async ({
  id,
  data,
}: {
  id: string;
  data: ProjectPayloadDTO;
}): Promise<ProjectDTO> => {
  const old = await db.projects.get(id);

  const updatedProject: ProjectModel = applyUpdates({
    id,
    old,
    updated: data,
  });

  await db.projects.update(id, data);

  return modelToDTO(updatedProject);
};

export const deleteLocalProject = async (id: string) => {
  await db.projects.delete(id);
};
