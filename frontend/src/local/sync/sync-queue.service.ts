import {
  createSessions,
  updateSessions,
  deleteSessions,
} from "../../features/sessions/api/sessions.api";

import { db } from "../indexedDB";

import type { SyncQueueModel } from "./sync-queue.model";

class SyncQueueService {
  async addToQueue<T extends SyncQueueModel["entityType"]>({
    entityType,
    action,
    payload,
  }: {
    entityType: T;
    action: SyncQueueModel["action"];
    payload: Extract<SyncQueueModel, { entityType: T }>["payload"];
  }) {
    await db.syncQueue.add({
      entityType,
      action,
      payload,
      status: "pending",
      timestamp: new Date(),
      retries: 0,
    } as SyncQueueModel);
  }

  async processQueue() {
    if (!navigator.onLine) return;

    const pendingOps = await db.syncQueue
      .where("status")
      .equals("pending")
      .sortBy("timestamp");

    for (const op of pendingOps) {
      try {
        await db.syncQueue.update(op.id!, { status: "processing" });

        if (op.entityType === "session") {
          if (op.action === "CREATE") {
            await createSessions([op.payload]);
          } else if (op.action === "UPDATE") {
            await updateSessions([op.payload]);
          } else if (op.action === "DELETE") {
            await deleteSessions([op.payload.id]);
          }
        }

        await db.syncQueue.delete(op.id!);
      } catch (error) {
        const retries = op.retries + 1;
        if (retries >= 5) {
          await db.syncQueue.update(op.id!, {
            status: "failed",
            error: String(error),
          });
        } else {
          await db.syncQueue.update(op.id!, { retries, status: "pending" });
        }
      }
    }
  }
}

export default new SyncQueueService();
