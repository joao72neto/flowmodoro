import { db } from "../../../indexedDB";
import type { SessionPayload } from "../api/sessions.types";
import { DEFAULT_SESSION } from "./consts/default-session";
import type { SessionModel } from "./session.model";

export const createSessionRepository = async (
  payload: SessionPayload,
): Promise<SessionModel> => {
  const session = {
    id: crypto.randomUUID(),
    name: payload.name || DEFAULT_SESSION.name,
    focus: payload.focus || DEFAULT_SESSION.focus,
    ratio: payload.ratio || DEFAULT_SESSION.ratio,
    rest: payload.rest || DEFAULT_SESSION.rest,
    projectId: payload.projectId || DEFAULT_SESSION.projectId,
    tagId: payload.tagId || DEFAULT_SESSION.tagId,
  };

  await db.sessions.add(session);

  return session;
};
