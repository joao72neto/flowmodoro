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
    const entityId = payload.id;

    await db.transaction("rw", db.syncQueue, async () => {
      const existingOps = await db.syncQueue
        .filter(
          (op) =>
            op.entityType === entityType &&
            op.status === "pending" &&
            op.payload.id === entityId,
        )
        .toArray();

      const existingOp = existingOps[0];

      if (existingOp) {
        if (existingOp.action === "CREATE" && action === "UPDATE") {
          await db.syncQueue.update(existingOp.id!, { payload });
          return;
        }

        if (existingOp.action === "CREATE" && action === "DELETE") {
          await db.syncQueue.delete(existingOp.id!);
          return;
        }

        if (existingOp.action === "UPDATE" && action === "UPDATE") {
          await db.syncQueue.update(existingOp.id!, { payload });
          return;
        }

        if (existingOp.action === "UPDATE" && action === "DELETE") {
          await db.syncQueue.update(existingOp.id!, {
            action: "DELETE",
            payload,
          });
          return;
        }
      } else {
        await db.syncQueue.add({
          entityType,
          action,
          payload,
          status: "pending",
          timestamp: new Date(),
          retries: 0,
        } as SyncQueueModel);
      }
    });
  }

  async processQueue() {
    if (!navigator.onLine) return;

    const pendingOps = await db.syncQueue
      .orderBy("id")
      .filter((op) => op.status === "pending")
      .toArray();

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
