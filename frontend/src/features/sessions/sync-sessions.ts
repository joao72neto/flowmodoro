import type { SessionModel } from "./local/session.model";
import type { SessionPayloadDTO } from "./dtos/sessions-request";

import { db } from "../../local/indexedDB";
import {
  createSessions,
  deleteSessions,
  updateSessions,
} from "./api/sessions.api";

import mapper from "./sessions.mappers";

class SyncSessions {
  async syncSessions() {
    await this.syncCreateSessions();
    await this.syncDeleteSessions();
    await this.syncUpdateSessions();
  }

  async syncFetchSessions() {}

  async syncCreateSessions() {
    const sessions: SessionModel[] = await db.sessions
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (sessions.length === 0) return;

    const payload: SessionPayloadDTO[] = mapper.toPayloadList(sessions);
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

  async syncUpdateSessions() {
    const sessions = await db.sessions
      .where("pending_action")
      .equals("UPDATE")
      .toArray();

    if (sessions.length === 0) return;

    const payload: SessionPayloadDTO[] = mapper.toPayloadList(sessions);
    await updateSessions(payload);

    await db.sessions.bulkPut(
      sessions.map((s) => ({ ...s, pending_action: null })),
    );
  }
}
export default new SyncSessions();
