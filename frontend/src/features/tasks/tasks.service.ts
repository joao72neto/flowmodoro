import type {
  TaskRequest,
  UpdateTaskNameRequest,
  UpdateTaskRequest,
} from "./tasks.types";
import api from "../../configs/api.config";

class TaskService {
  async createTask(data: TaskRequest) {
    return await api.post("/task", data);
  }

  async fetchTasks() {
    return await api.get("/task");
  }

  async deleteTask(id: number) {
    return await api.delete(`/task/${id}`);
  }

  async updateTaskStatus(id: number, data: UpdateTaskRequest) {
    return await api.patch(`/task/${id}/status`, data);
  }

  async updateTask(id: number, data: UpdateTaskNameRequest) {
    return await api.put(`/task/${id}`, data);
  }
}

export default new TaskService();
