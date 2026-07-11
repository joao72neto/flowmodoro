import type { SessionModel } from "./local/session.model";
import { db } from "../../local/indexedDB";

class SyncSessions {
  async syncCreateSession() {
    const sessions: SessionModel[] = await db.sessions
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (sessions.length === 0) return;
  }
}
export default new SyncSessions();
