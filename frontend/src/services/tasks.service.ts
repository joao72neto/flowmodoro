import type { TaskModel } from "../types/tasks.types";
import api from "./api";

class TaskService {
  async createTask(data: TaskModel) {
    return await api.post("/task", data);
  }

  async fetchTasks() {
    return await api.get("/task");
  }
}

export default new TaskService();
