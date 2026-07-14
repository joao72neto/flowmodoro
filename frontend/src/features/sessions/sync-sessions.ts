import type { SessionModel } from "./local/session.model";
import type { CreateSessionDTO } from "./dtos/sessions-request";

import { db } from "../../local/indexedDB";
import { createSessions, deleteSessions } from "./api/sessions.api";

import mapper from "./sessions.mappers";

class SyncSessions {
  async syncCreateSessions() {
    const sessions: SessionModel[] = await db.sessions
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (sessions.length === 0) return;

    const payload: CreateSessionDTO[] = mapper.toCreateSessionsDTO(sessions);
    await createSessions(payload);

    await db.sessions.bulkPut(
      sessions.map((s) => ({ ...s, pending_action: null })),
    );
  }

  async syncDeleteSessions() {
    const sessions = await db.sessions
      .where("pending_action")
      .equals("DELETE")
      .toArray();

    if (sessions.length === 0) return;

    const ids = sessions.map((s) => s.id);

    await deleteSessions(ids);
    await db.sessions.bulkDelete(ids);
  }
}
export default new SyncSessions();
