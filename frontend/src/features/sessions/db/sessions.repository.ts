import { db } from "../../../indexedDB";
import type { PaginationResponse } from "../../../shared/global.types";
import type { SessionModel } from "./session.model";
import type {
  SessionPayloadDTO,
  SessionDTO,
  DailySessionsDTO,
} from "./session.dtos";
import { payloadToModel, modelToDTO } from "./sessions.mappers";
import { applyUpdates } from "./utils/apply-updates";
import {
  groupSessions,
  groupSessionsByDate,
  normalizeSessions,
} from "./utils/group-sessions";

export const fetchLocalSessions = async ({
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
  const groupedSessions = groupSessions(normalizedSessions);
  const groupedSessionsByDate = groupSessionsByDate(groupedSessions);

  return {
    content: groupedSessionsByDate,
    page,
    size,
    totalElements: sessions.length,
    totalPages: Math.ceil(sessions.length / size),
  };
};

export const createLocalSession = async (
  payload: SessionPayloadDTO,
): Promise<SessionDTO> => {
  const session: SessionModel = payloadToModel(payload);

  await db.sessions.add(session);

  const project = await db.projects.get(session.projectId || "");
  const tag = await db.tags.get(session.tagId || "");

  return modelToDTO({ session, project, tag });
};

export const updateLocalSession = async ({
  id,
  data,
}: {
  id: string;
  data: SessionPayloadDTO;
}): Promise<SessionDTO> => {
  const old = await db.sessions.get(id);

  const updatedSession: SessionModel = applyUpdates({
    id,
    old,
    updated: data,
  });

  await db.sessions.update(id, data);

  const project = await db.projects.get(updatedSession.projectId || "");
  const tag = await db.tags.get(updatedSession.tagId || "");

  return modelToDTO({ session: updatedSession, project, tag });
};

export const deleteLocalSession = async (id: string) => {
  await db.sessions.delete(id);
};
