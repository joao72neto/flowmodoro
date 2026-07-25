import { db } from "../../../local/indexedDB";
import type {
  ProjectPayloadDTO,
  ProjectUpdateDTO,
} from "../dtos/projects-request";
import type { ProjectDTO } from "../dtos/projects-response";

import type { ProjectModel } from "./project.model";
import { applyUpdates } from "./utils/apply-updates";

import mapper from "../projects.mappers";

import syncQueue from "../../../local/sync/sync-queue.service";

export const fetchProjects = async (): Promise<ProjectDTO[]> => {
  const [projects, sessions] = await Promise.all([
    db.projects.orderBy("createdAt").reverse().toArray(),
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
  const project: ProjectModel = mapper.fromPayload(payload);

  await db.projects.add(project);

  const saveToQueue = mapper.toPayload(project);
  await syncQueue.addToQueue({
    entityType: "project",
    action: "CREATE",
    payload: saveToQueue,
  });

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
  if (!old) throw new Error("Project not found locally");

  const updatedProject: ProjectModel = applyUpdates({
    id,
    old,
    updated: data,
  });

  await db.projects.update(id, updatedProject);

  const saveToQueue = mapper.toPayload(updatedProject);
  await syncQueue.addToQueue({
    entityType: "project",
    action: "UPDATE",
    payload: saveToQueue,
  });

  return mapper.fromModel(updatedProject);
};

export const deleteProject = async (id: string) => {
  const project = await db.projects.get(id);
  if (!project) return;

  const saveToQueue = mapper.toPayload(project);
  await syncQueue.addToQueue({
    entityType: "project",
    action: "DELETE",
    payload: saveToQueue,
  });

  await db.projects.delete(id);
};
