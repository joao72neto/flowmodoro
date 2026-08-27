import { db } from "../indexedDB";
import { localStorageKeys } from "../../shared/utils/storage.utils";
import { pullSessions } from "../../features/sessions/api/sessions.api";
import mapper from "../../features/sessions/sessions.mappers";

export const executePull = async (): Promise<void> => {
  const lastSync = localStorage.getItem(localStorageKeys.lastSync);
  const syncStartTime = new Date().toISOString();

  const apiSessions = await pullSessions(lastSync);

  if (!apiSessions || apiSessions.length === 0) {
    localStorage.setItem(localStorageKeys.lastSync, syncStartTime);
    return;
  }

  for (const apiSession of apiSessions) {
    const local = await db.sessions.get(apiSession.id);

    if (local) {
      // Conflict resolution: compare updatedAt
      const localUpdated = local.updatedAt
        ? new Date(local.updatedAt).getTime()
        : 0;
      const apiUpdated = apiSession.updatedAt
        ? new Date(apiSession.updatedAt).getTime()
        : 0;

      if (apiUpdated >= localUpdated) {
        await db.sessions.put(mapper.fromDTO(apiSession));
      }
    } else {
      await db.sessions.put(mapper.fromDTO(apiSession));
    }
  }

  localStorage.setItem(localStorageKeys.lastSync, syncStartTime);
};
