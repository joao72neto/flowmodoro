import type {
  CreateSessionRequest,
  UpdateSessionRequest,
} from "./session.types";
import api from "../../configs/api.config";

class SessionService {
  async getSessions(page: number = 1, size: number = 10) {
    return await api.get("/session", { params: { page, size } });
  }

  async createSession(id: number, data: CreateSessionRequest) {
    return await api.post(`/session/${id}`, data);
  }

  async deleleSession(id: number) {
    return await api.delete(`/session/${id}`);
  }

  async updateSession(id: number, data: UpdateSessionRequest) {
    return await api.put(`/session/${id}`, data);
  }
}

export default new SessionService();
