import type { SessionRequest } from "./session.types";
import api from "../../configs/api.config";

class SessionService {
  async getSessions(page: number = 1, size: number = 10) {
    return await api.get("/session", { params: { page, size } });
  }
  async createSession(id: number, data: SessionRequest) {
    return await api.post(`/session/${id}`, data);
  }
}

export default new SessionService();
