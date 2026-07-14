import { db } from "../../../local/indexedDB";
import type { PaginationResponse } from "../../../shared/global.types";
import type { SessionModel } from "./session.model";
import type { SessionDTO, DailySessionsDTO } from "../dtos/sessions-response";
import type {
  CreateSessionDTO,
  UpdateSessionDTO,
} from "../dtos/sessions-request";

import { applyUpdates } from "./utils/apply-updates";
import { buildDailySessions, normalizeSessions } from "./utils/group-sessions";

import mapper from "../sessions.mappers";

export const fetchSessions = async ({
  page = 1,
  size = 10,
}: {
  page: number;
  size: number;
}): Promise<PaginationResponse<DailySessionsDTO>> => {
  const sessions = await db.sessions.toArray();
  const projects = await db.projects.toArray();
  const tags = await db.tags.toArray();

  const normalizedSessions = normalizeSessions({
    sessions,
    projects,
    tags,
  });
  const content = buildDailySessions(normalizedSessions);

  const totalElements = content.length;
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = (page - 1) * size;
  const paginatedContent = content.slice(startIndex, startIndex + size);

  return {
    content: paginatedContent,
    page,
    size,
    totalElements,
    totalPages,
  };
};

export const createSession = async (
  payload: CreateSessionDTO,
): Promise<SessionDTO> => {
  const session: SessionModel = mapper.toEntity(payload);

  await db.sessions.add(session);

  const project = await db.projects.get(session.projectId || "");
  const tag = await db.tags.get(session.tagId || "");

  return mapper.toDTO({ session, project, tag });
};

export const updateSession = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateSessionDTO;
}): Promise<SessionDTO> => {
  const old = await db.sessions.get(id);

  const updatedSession: SessionModel = applyUpdates({
    id,
    old,
    updated: data,
  });

  await db.sessions.update(id, updatedSession);

  const project = await db.projects.get(updatedSession.projectId || "");
  const tag = await db.tags.get(updatedSession.tagId || "");

  return mapper.toDTO({ session: updatedSession, project, tag });
};

export const deleteSession = async (id: string) => {
  await db.sessions.delete(id);
};
