import {
  createSessions,
  updateSessions,
  deleteSessions,
} from "../../features/sessions/api/sessions.api";

import {
  createProjects,
  updateProjects,
  deleteProjects,
} from "../../features/projects/api/projects.api";

import {
  createTags,
  updateTags,
  deleteTags,
} from "../../features/tags/api/tags.api";

import { db } from "../indexedDB";

import type { SyncQueueModel } from "./sync-queue.model";

class SyncQueueService {
  private isProcessing = false;

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
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      const now = new Date();

      const pendingOps = await db.syncQueue
        .orderBy("id")
        .filter(
          (op) =>
            (op.status === "pending" || op.status === "failed") &&
            (!op.nextAttemptAt || op.nextAttemptAt <= now),
        )
        .toArray();

      const getPriority = (op: SyncQueueModel) => {
        if (op.action === "CREATE" || op.action === "UPDATE") {
          if (op.entityType === "project") return 1;
          if (op.entityType === "tag") return 2;
          if (op.entityType === "session") return 3;
        } else if (op.action === "DELETE") {
          if (op.entityType === "session") return 4;
          if (op.entityType === "tag") return 5;
          if (op.entityType === "project") return 6;
        }
        return 99;
      };

      pendingOps.sort((a, b) => {
        const priorityA = getPriority(a);
        const priorityB = getPriority(b);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        return Number(a.id!) - Number(b.id!);
      });

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

          if (op.entityType === "project") {
            if (op.action === "CREATE") {
              await createProjects([op.payload]);
            } else if (op.action === "UPDATE") {
              await updateProjects([op.payload]);
            } else if (op.action === "DELETE") {
              await deleteProjects([op.payload.id]);
            }
          }

          if (op.entityType === "tag") {
            if (op.action === "CREATE") {
              await createTags([op.payload]);
            } else if (op.action === "UPDATE") {
              await updateTags([op.payload]);
            } else if (op.action === "DELETE") {
              await deleteTags([op.payload.id]);
            }
          }

          await db.syncQueue.delete(op.id!);
        } catch (error) {
          const retries = op.retries + 1;

          const delayMs = Math.min(5_000 * 2 ** retries, 5 * 60_000);
          const nextAttemptAt = new Date(Date.now() + delayMs);

          await db.syncQueue.update(op.id!, {
            retries,
            status: "pending",
            nextAttemptAt,
            error: String(error),
          });
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

export default new SyncQueueService();
