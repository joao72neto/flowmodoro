import api from "./api";

class SessionService {
  async getSessions() {
    return await api.get("/session");
  }
  async createSession(data: any, taskId: number) {
    return await api.post("/session", data, { params: { task: taskId } });
  }
}

export default new SessionService();
