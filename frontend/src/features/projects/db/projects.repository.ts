import { db } from "../../../indexedDB";
import type { ProjectPayload } from "../api/projects.types";
import { DEFAULT_PROJECT } from "./consts/default-project";
import type { ProjectModel } from "./project.model";

export const fetchLocalProjects = async (): Promise<ProjectModel[]> => {
  return db.projects.toArray();
};

export const createLocalProject = async (
  payload: ProjectPayload,
): Promise<ProjectModel> => {
  const project = {
    id: crypto.randomUUID(),
    name: payload.name || DEFAULT_PROJECT.name,
  };

  await db.projects.add(project);

  return project;
};

export const updateLocalProject = async ({
  id,
  data,
}: {
  id: string;
  data: ProjectPayload;
}): Promise<ProjectModel> => {
  const oldProject = await db.projects.get(id);

  const updatedProject: ProjectModel = {
    id,
    name: data.name || oldProject?.name || DEFAULT_PROJECT.name,
  };

  await db.projects.update(id, data);

  return updatedProject;
};

export const deleteLocalProject = async (id: string) => {
  await db.projects.delete(id);
};
