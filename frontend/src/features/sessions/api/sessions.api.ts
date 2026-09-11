import api from "../../../configs/api.configs";
import type { SessionPayloadDTO } from "../dtos/sessions-request";
import type { SessionDTO } from "../dtos/sessions-response";

export const pullSessions = async (
  lastSync?: string | null,
): Promise<SessionDTO[]> => {
  const params = lastSync ? { lastSync } : {};
  const res = await api.get<SessionDTO[]>("/sessions/pull", { params });
  return res.data;
};

export const createSessions = async (
  data: SessionPayloadDTO[],
): Promise<SessionDTO[]> => {
  const res = await api.post<SessionDTO[]>("/sessions/bulk", data);
  return res.data;
};

export const updateSessions = async (
  data: SessionPayloadDTO[],
): Promise<SessionDTO[]> => {
  const res = await api.put<SessionDTO[]>("/sessions/bulk", data);
  return res.data;
};

export const deleteSessions = async (ids: string[]): Promise<void> => {
  return api.delete(`/sessions/bulk`, { data: ids });
};
