import { db } from "../../../indexedDB";
import type { ProjectDTO, ProjectPayloadDTO } from "./project.dtos";
import type { ProjectModel } from "./project.model";
import { modelToDTO, payloadToModel } from "./projects.mappers";
import { applyUpdates } from "./utils/apply-updates";

export const fetchLocalProjects = async (): Promise<ProjectDTO[]> => {
  const [projects, sessions] = await Promise.all([
    db.projects.orderBy("id").reverse().toArray(),
    db.sessions.toArray(),
  ]);

  const focusPerProject = sessions.reduce(
    (acumulador, session) => {
      const pId = session.projectId;
      if (!pId) return acumulador;

      acumulador[pId] = (acumulador[pId] || 0) + (session.focus || 0);
      return acumulador;
    },
    {} as Record<string, number>,
  );

  return projects.map((project) => ({
    ...project,
    totalFocus: focusPerProject[project.id] || 0,
  }));
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
  await db.tags.where("projectId").equals(id).delete();
  await db.projects.delete(id);
};
