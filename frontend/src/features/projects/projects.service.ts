import api from "../../configs/api.config";
import type { ProjectResponse } from "./projects.types";

class ProjectService {
  async fetchProjects(): Promise<ProjectResponse[]> {
    const res = await api.get<ProjectResponse[]>("/projects");
    return res.data;
  }
}

export default new ProjectService();
