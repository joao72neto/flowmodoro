import type { SessionModel } from "./local/session.model";
import type { CreateSessionDTO } from "./dtos/sessions-request.dtos";

import { db } from "../../local/indexedDB";
import { createManySessions } from "./api/sessions.api";

class SyncSessions {
  async syncCreateSession() {
    const sessions: SessionModel[] = await db.sessions
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (sessions.length === 0) return;

    const payload: CreateSessionDTO[] = preparePayload(sessions);
    await createManySessions(payload);

    await db.sessions.bulkPut(
      sessions.map((s) => ({ ...s, pending_action: null })),
    );
  }
}
export default new SyncSessions();

const preparePayload = (sessions: SessionModel[]): CreateSessionDTO[] => {
  return sessions.map((s) => ({
    id: s.id,
    name: s.name,
    focus: s.focus,
    ratio: s.ratio,
    rest: s.rest,
    projectId: s.projectId,
    tagId: s.tagId,
  }));
};
