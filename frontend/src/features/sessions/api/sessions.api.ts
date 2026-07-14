import api from "../../../configs/api.configs";
import type {
  CreateSessionDTO,
  UpdateSessionDTO,
} from "../dtos/sessions-request";
import type { SessionDTO } from "../dtos/sessions-response";

import type { PaginationResponse } from "../../../shared/global.types";
import type {
  SessionPayload,
  SessionGroupResponse,
  SessionResponse,
} from "./sessions.types";

export const fetchSessions = async ({
  page = 1,
  size = 10,
}: {
  page: number;
  size: number;
}): Promise<PaginationResponse<SessionGroupResponse>> => {
  const res = await api.get<PaginationResponse<SessionGroupResponse>>(
    "/sessions",
    { params: { page, size } },
  );

  return res.data;
};

export const createManySessions = async (
  data: CreateSessionDTO[],
): Promise<SessionDTO[]> => {
  const res = await api.post<SessionDTO[]>("/sessions/create-many", data);
  return res.data;
};

export const createSession = async (
  data: UpdateSessionDTO,
): Promise<SessionDTO> => {
  const res = await api.post<SessionDTO>("/sessions", data);
  return res.data;
};

export const updateSession = async ({
  id,
  data,
}: {
  id: number;
  data: SessionPayload;
}): Promise<SessionResponse> => {
  const res = await api.put<SessionResponse>(`/sessions/${id}`, data);
  return res.data;
};

export const deleteSession = async (id: number) => {
  return api.delete(`/sessions/${id}`);
};
