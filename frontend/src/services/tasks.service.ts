import api from "./api";

class TaskService {
  async createTask(data: any) {
    return await api.post("/task", data);
  }
}

export default new TaskService();
