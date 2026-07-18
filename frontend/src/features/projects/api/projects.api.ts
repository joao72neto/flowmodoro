import api from "../../../configs/api.configs";
import type { ProjectPayloadDTO } from "../dtos/projects-request";
import type { ProjectDTO } from "../dtos/projects-response";

export const fetchProjects = async (): Promise<ProjectDTO[]> => {
  const res = await api.get<ProjectDTO[]>("/projects");
  return res.data;
};

export const createProject = async (
  data: ProjectPayloadDTO,
): Promise<ProjectDTO> => {
  const res = await api.post<ProjectDTO>("/projects", data);
  return res.data;
};

export const updateProject = async ({
  id,
  data,
}: {
  id: number;
  data: ProjectPayloadDTO;
}): Promise<ProjectDTO> => {
  const res = await api.put<ProjectDTO>(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  return api.delete(`/projects/${id}`);
};

export const createProjects = async (
  data: ProjectPayloadDTO[],
): Promise<ProjectDTO[]> => {
  const res = await api.post<ProjectDTO[]>("/projects/bulk", data);
  return res.data;
};
