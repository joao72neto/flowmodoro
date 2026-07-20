import { db } from "../../../local/indexedDB";
import type {
  ProjectPayloadDTO,
  ProjectUpdateDTO,
} from "../dtos/projects-request";
import type { ProjectDTO } from "../dtos/projects-response";

import type { ProjectModel } from "./project.model";
import { applyUpdates } from "./utils/apply-updates";

import mapper from "../projects.mappers";

export const fetchProjects = async (): Promise<ProjectDTO[]> => {
  const [projects, sessions] = await Promise.all([
    db.projects
      .orderBy("createdAt")
      .reverse()
      .filter((project) => !project.deleted)
      .toArray(),

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

export const createProject = async (
  payload: ProjectPayloadDTO,
): Promise<ProjectDTO> => {
  const project: ProjectModel = {
    ...mapper.fromPayload(payload),
    pending_action: "CREATE",
  };

  await db.projects.add(project);
  return mapper.fromModel(project);
};

export const updateProject = async ({
  id,
  data,
}: {
  id: string;
  data: ProjectUpdateDTO;
}): Promise<ProjectDTO> => {
  const old = await db.projects.get(id);

  const updatedProject: ProjectModel = applyUpdates({
    id,
    old,
    updated: data,
  });

  await db.projects.update(id, updatedProject);
  return mapper.fromModel(updatedProject);
};

export const deleteProject = async (id: string) => {
  const project = await db.projects.get(id);
  if (!project) return;

  if (project.pending_action === "CREATE") {
    await db.projects.delete(id);
    return;
  }

  await db.projects.update(id, {
    deleted: true,
    pending_action: "DELETE",
  });
};
