import api from "../../configs/api.configs";
import type { PaginationResponse } from "../../shared/global.types";
import type {
  SessionPayload,
  SessionGroupResponse,
  SessionResponse,
} from "./sessions.types";

class SessionService {
  async fetchSessions({
    page = 1,
    size = 10,
  }: {
    page: number;
    size: number;
  }): Promise<PaginationResponse<SessionGroupResponse>> {
    const res = await api.get<PaginationResponse<SessionGroupResponse>>(
      "/sessions",
      { params: { page, size } },
    );
    return res.data;
  }

  async createSession(data: SessionPayload): Promise<SessionResponse> {
    const res = await api.post<SessionResponse>("/sessions", data);
    return res.data;
  }

  async updateSession({
    id,
    data,
  }: {
    id: number;
    data: SessionPayload;
  }): Promise<SessionResponse> {
    const res = await api.put<SessionResponse>(`/sessions/${id}`, data);
    return res.data;
  }

  async deleteSession(id: number) {
    return await api.delete(`/sessions/${id}`);
  }
}

export default new SessionService();
