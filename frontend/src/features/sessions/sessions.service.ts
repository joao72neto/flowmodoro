import api from "../../configs/api.config";
import type { PaginationResponse } from "../../shared/globals.types";
import type {
  CreateSessionRequest,
  ISessionGroupResponse,
  SessionResponse,
  UpdateSessionRequest,
} from "./sessions.types";

class SessionService {
  async getSessions({
    page = 1,
    size = 10,
  }: {
    page: number;
    size: number;
  }): Promise<PaginationResponse<ISessionGroupResponse>> {
    const res = await api.get<PaginationResponse<ISessionGroupResponse>>(
      "/sessions",
      { params: { page, size } },
    );
    return res.data;
  }

  async createSession(data: CreateSessionRequest): Promise<SessionResponse> {
    const res = await api.post<SessionResponse>("/sessions", data);
    return res.data;
  }

  async updateSession({
    id,
    data,
  }: {
    id: number;
    data: UpdateSessionRequest;
  }): Promise<SessionResponse> {
    const res = await api.put<SessionResponse>(`/sessions/${id}`, data);
    return res.data;
  }

  async deleteSession(id: number) {
    return await api.delete(`/sessions/${id}`);
  }
}

export default new SessionService();
