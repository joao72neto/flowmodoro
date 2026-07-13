import type { SessionModel } from "./local/session.model";
import { db } from "../../local/indexedDB";
import { createSession } from "./api/sessions.api";

class SyncSessions {
  async syncCreateSession() {
    const sessions: SessionModel[] = await db.sessions
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (sessions.length === 0) return;

    for (const session of sessions) {
      await createSession(session);
    }
  }
}
export default new SyncSessions();
