import type { SessionRequest } from "../types/sessions.types";
import api from "../../../configs/api";

class SessionService {
  async getSessions() {
    return await api.get("/session");
  }
  async createSession(id: number, data: SessionRequest) {
    return await api.post(`/session/${id}`, data, {
      params: { page: 1, size: 10 },
    });
  }
}

export default new SessionService();
