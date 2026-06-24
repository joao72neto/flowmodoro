import api from "../../configs/api.config";
import type { CreateProjectRequest, ProjectResponse } from "./projects.types";

class ProjectService {
  async fetchProjects(): Promise<ProjectResponse[]> {
    const res = await api.get<ProjectResponse[]>("/projects");
    return res.data;
  }

  async createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
    const res = await api.post<ProjectResponse>("/projects", data);
    return res.data;
  }

  async deleteProject(id: number) {
    return await api.delete(`/projects/${id}`);
  }
}

export default new ProjectService();
