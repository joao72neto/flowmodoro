import type {
  TaskRequest,
  UpdateTaskNameRequest,
  UpdateTaskRequest,
} from "./tasks.types";
import api from "../../configs/api.config";

class TaskService {
  async createTask(data: TaskRequest) {
    return await api.post("/tasks", data);
  }

  async fetchTasks() {
    return await api.get("/tasks");
  }

  async deleteTask(id: number) {
    return await api.delete(`/tasks/${id}`);
  }

  async updateTaskStatus(id: number, data: UpdateTaskRequest) {
    return await api.patch(`/tasks/${id}/status`, data);
  }

  async updateTask(id: number, data: UpdateTaskNameRequest) {
    return await api.put(`/tasks/${id}`, data);
  }
}

export default new TaskService();
