import api from "../configs/api.configs";

class HealthService {
  async getHealth() {
    return await api.get("/health");
  }
}

export default new HealthService();
