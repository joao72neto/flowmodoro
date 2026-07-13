import type { SessionModel } from "./local/session.model";
import type { SessionPayloadDTO } from "./local/session.dtos";

import { db } from "../../local/indexedDB";
import { createManySessions } from "./api/sessions.api";
import { modelToPayloadArray } from "./local/sessions.mappers";

class SyncSessions {
  async syncCreateSession() {
    const sessions: SessionModel[] = await db.sessions
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (sessions.length === 0) return;

    const payload: SessionPayloadDTO[] = modelToPayloadArray(sessions);
    await createManySessions(payload);
  }
}
export default new SyncSessions();
