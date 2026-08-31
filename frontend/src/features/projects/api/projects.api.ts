import api from "../../../configs/api.configs";
import type { ProjectPayloadDTO } from "../dtos/projects-request";
import type { ProjectDTO } from "../dtos/projects-response";

export const pullProjects = async (
  lastSync?: string | null,
): Promise<ProjectDTO[]> => {
  const params = lastSync ? { lastSync } : {};
  const res = await api.get<ProjectDTO[]>("/projects/pull", { params });
  return res.data;
};

export const createProjects = async (
  data: ProjectPayloadDTO[],
): Promise<ProjectDTO[]> => {
  const res = await api.post<ProjectDTO[]>("/projects/bulk", data);
  return res.data;
};

export const updateProjects = async (
  data: ProjectPayloadDTO[],
): Promise<ProjectDTO[]> => {
  const res = await api.put<ProjectDTO[]>("/projects/bulk", data);
  return res.data;
};

export const deleteProjects = async (ids: string[]): Promise<void> => {
  await api.delete(`/projects/bulk`, { data: ids });
};
