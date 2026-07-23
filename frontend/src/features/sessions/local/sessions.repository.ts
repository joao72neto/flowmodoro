import { db } from "../../../local/indexedDB";
import type { PaginationResponse } from "../../../shared/types/global.types";
import type { SessionModel } from "./session.model";
import type { SessionDTO, DailySessionsDTO } from "../dtos/sessions-response";
import type {
  SessionPayloadDTO,
  SessionUpdateDTO,
} from "../dtos/sessions-request";

import { applyUpdates } from "./utils/apply-updates";
import { buildDailySessions, normalizeSessions } from "./utils/group-sessions";

import mapper from "../sessions.mappers";
import syncQueue from "../../../local/sync/sync-queue.service";

import { triggerSync } from "../../../local/sync/sync-manager";

export const fetchSessions = async ({
  page = 1,
  size = 10,
}: {
  page: number;
  size: number;
}): Promise<PaginationResponse<DailySessionsDTO>> => {
  const sessions = await db.sessions
    .filter((session) => !session.deleted)
    .toArray();
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
  payload: SessionPayloadDTO,
): Promise<SessionDTO> => {
  const session: SessionModel = {
    ...mapper.fromPayload(payload),
    pending_action: "CREATE",
  };

  await db.sessions.put(session);

  const saveToQueue = mapper.toPayload(session);
  syncQueue.addToQueue({
    entityType: "session",
    action: "CREATE",
    payload: saveToQueue,
  });

  triggerSync();

  const project = await db.projects.get(session.projectId || "");
  const tag = await db.tags.get(session.tagId || "");

  return mapper.buildDTO({ session, project, tag });
};

export const updateSession = async ({
  id,
  data,
}: {
  id: string;
  data: SessionUpdateDTO;
}): Promise<SessionDTO> => {
  const old = await db.sessions.get(id);
  if (!old) throw new Error("Session not found locally");

  const updatedSession: SessionModel = applyUpdates({
    id,
    old,
    updated: data,
    pending_action: "UPDATE",
  });

  await db.sessions.update(id, updatedSession);

  const saveToQueue = mapper.toPayload(updatedSession);
  syncQueue.addToQueue({
    entityType: "session",
    action: "UPDATE",
    payload: saveToQueue,
  });

  triggerSync();

  const project = await db.projects.get(updatedSession.projectId || "");
  const tag = await db.tags.get(updatedSession.tagId || "");

  return mapper.buildDTO({ session: updatedSession, project, tag });
};

export const deleteSession = async (id: string) => {
  const session = await db.sessions.get(id);
  if (!session) return;

  const saveToQueue = mapper.toPayload(session);
  syncQueue.addToQueue({
    entityType: "session",
    action: "DELETE",
    payload: saveToQueue,
  });

  await db.sessions.delete(id);

  triggerSync();
};
