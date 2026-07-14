import type { SessionModel } from "./local/session.model";
import type { CreateSessionDTO } from "./dtos/sessions-request";

import { db } from "../../local/indexedDB";
import { createManySessions } from "./api/sessions.api";

import mapper from "./local/sessions.mappers";

class SyncSessions {
  async syncCreateSession() {
    const sessions: SessionModel[] = await db.sessions
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (sessions.length === 0) return;

    const payload: CreateSessionDTO[] = mapper.toCreateSessionsDTO(sessions);
    await createManySessions(payload);

    await db.sessions.bulkPut(
      sessions.map((s) => ({ ...s, pending_action: null })),
    );
  }
}
export default new SyncSessions();
