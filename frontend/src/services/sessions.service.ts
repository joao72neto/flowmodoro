import api from "./api";

class SessionService {
  async getSessions() {
    return await api.get("/session");
  }
  async createSession(data: any) {
    return await api.post("/session", data);
  }
}

export default new SessionService();
