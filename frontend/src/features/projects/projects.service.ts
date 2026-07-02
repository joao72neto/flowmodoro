import api from "../../configs/api.configs";
import type { ProjectPayload, ProjectResponse } from "./projects.types";

class ProjectService {
  async fetchProjects(): Promise<ProjectResponse[]> {
    const res = await api.get<ProjectResponse[]>("/projects");
    return res.data;
  }

  async createProject(data: ProjectPayload): Promise<ProjectResponse> {
    const res = await api.post<ProjectResponse>("/projects", data);
    return res.data;
  }

  async updateProject({
    id,
    data,
  }: {
    id: number;
    data: ProjectPayload;
  }): Promise<ProjectResponse> {
    const res = await api.put<ProjectResponse>(`/projects/${id}`, data);
    return res.data;
  }

  async deleteProject(id: number): Promise<void> {
    return await api.delete(`/projects/${id}`);
  }
}

export default new ProjectService();
