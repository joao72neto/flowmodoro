import type {
  CreateSessionRequest,
  ISessionGroupResponse,
  UpdateSessionRequest,
} from "./session.types";
import api from "../../configs/api.config";
import type { PaginationResponse } from "../../shared/globals.types";

class SessionService {
  async getSessions({
    page = 1,
    size = 10,
  }: {
    page: number;
    size: number;
  }): Promise<PaginationResponse<ISessionGroupResponse>> {
    const res = await api.get<PaginationResponse<ISessionGroupResponse>>(
      "/session",
      { params: { page, size } },
    );
    return res.data;
  }

  async createSession(id: number, data: CreateSessionRequest) {
    return await api.post(`/session/${id}`, data);
  }

  async deleteSession(id: number) {
    return await api.delete(`/session/${id}`);
  }

  async updateSession(id: number, data: UpdateSessionRequest) {
    return await api.put(`/session/${id}`, data);
  }
}

export default new SessionService();
