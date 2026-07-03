import api from "../../../configs/api.configs";
import type { ProjectPayload, ProjectResponse } from "./projects.types";

export const fetchProjects = async (): Promise<ProjectResponse[]> => {
  const res = await api.get<ProjectResponse[]>("/projects");
  return res.data;
};

export const createProject = async (
  data: ProjectPayload,
): Promise<ProjectResponse> => {
  const res = await api.post<ProjectResponse>("/projects", data);
  return res.data;
};

export const updateProject = async ({
  id,
  data,
}: {
  id: number;
  data: ProjectPayload;
}): Promise<ProjectResponse> => {
  const res = await api.put<ProjectResponse>(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  return api.delete(`/projects/${id}`);
};
