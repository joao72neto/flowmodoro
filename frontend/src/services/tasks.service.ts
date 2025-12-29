import type { TaskModel, UpdateTaskRequest } from "../types/tasks.types";
import api from "./api";

class TaskService {
  async createTask(data: TaskModel) {
    return await api.post("/task", data);
  }

  async fetchTasks() {
    return await api.get("/task");
  }

  async deleteTask(id: number) {
    return await api.delete(`/task/${id}`);
  }

  async updateTaskStatus(id: number, data: UpdateTaskRequest) {
    return await api.patch(`/task/${id}`, data);
  }
}

export default new TaskService();
