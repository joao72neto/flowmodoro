import api from "../configs/api.config";

class HealthService {
  async getHealth() {
    return await api.get("/health");
  }
}

export default new HealthService();
