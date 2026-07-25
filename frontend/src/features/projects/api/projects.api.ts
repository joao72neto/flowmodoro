import api from "../../../configs/api.configs";
import type { ProjectPayloadDTO } from "../dtos/projects-request";
import type { ProjectDTO } from "../dtos/projects-response";

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
