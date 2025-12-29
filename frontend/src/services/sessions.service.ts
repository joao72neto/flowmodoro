import type { SessionRequest } from "../types/sessions.types";
import api from "./api";

class SessionService {
  async getSessions() {
    return await api.get("/session");
  }
  async createSession(data: SessionRequest, taskId: number) {
    return await api.post(`/session/${taskId}`, data);
  }
}

export default new SessionService();
