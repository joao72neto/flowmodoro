import type {
  TaskRequest,
  UpdateTaskRequest,
} from "../types/tasks.types";
import api from "../../../services/api";

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
}

export default new TaskService();
