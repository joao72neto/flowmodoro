import api from "../../../configs/api.configs";
import type {
  CreateSessionDTO,
  UpdateSessionDTO,
} from "../dtos/sessions-request";
import type { SessionDTO } from "../dtos/sessions-response";
import type { SessionGroupDTO } from "../dtos/sessions-response";
import type { PaginationResponse } from "../../../shared/global.types";

export const fetchSessions = async ({
  page = 1,
  size = 10,
}: {
  page: number;
  size: number;
}): Promise<PaginationResponse<SessionGroupDTO>> => {
  const res = await api.get<PaginationResponse<SessionGroupDTO>>("/sessions", {
    params: { page, size },
  });

  return res.data;
};

export const createSessions = async (
  data: CreateSessionDTO[],
): Promise<SessionDTO[]> => {
  const res = await api.post<SessionDTO[]>("/sessions/bulk", data);
  return res.data;
};

export const createSession = async (
  data: UpdateSessionDTO,
): Promise<SessionDTO> => {
  const res = await api.post<SessionDTO>("/sessions", data);
  return res.data;
};

export const updateSessions = async (
  data: UpdateSessionDTO[],
): Promise<SessionDTO[]> => {
  const res = await api.put<SessionDTO[]>("/sessions/bulk", data);
  return res.data;
};

export const updateSession = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateSessionDTO;
}): Promise<SessionDTO> => {
  const res = await api.put<SessionDTO>(`/sessions/${id}`, data);
  return res.data;
};

export const deleteSessions = async (ids: string[]): Promise<void> => {
  return api.delete(`/sessions/bulk`, { data: ids });
};

export const deleteSession = async (id: string) => {
  return api.delete(`/sessions/${id}`);
};
