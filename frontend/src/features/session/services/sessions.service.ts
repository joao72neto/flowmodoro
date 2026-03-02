import type { SessionRequest } from "../types/sessions.types";
import api from "../../../configs/api";

class SessionService {
  async getSessions() {
    return await api.get("/session");
  }
  async createSession(id: number, data: SessionRequest) {
    return await api.post(`/session/${id}`, data);
  }
}

export default new SessionService();
