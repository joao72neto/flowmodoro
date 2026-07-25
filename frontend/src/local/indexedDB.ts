import Dexie, { type Table } from "dexie";
import type { SessionModel } from "../features/sessions/local/session.model";
import type { ProjectModel } from "../features/projects/local/project.model";
import type { TagModel } from "../features/tags/local/tag.model";

import type { SyncQueueModel } from "./sync/sync-queue.model";

class AppDB extends Dexie {
  sessions!: Table<SessionModel, string>;
  projects!: Table<ProjectModel, string>;
  tags!: Table<TagModel, string>;
  syncQueue!: Table<SyncQueueModel, string>;

  constructor() {
    super("flowmodoro-db");

    this.version(13).stores({
      sessions: "id",
      projects: "id, &name, createdAt, pending_action",
      tags: "id, projectId, &name, createdAt, pending_action",
      syncQueue: "++id, entityType, action, status, timestamp, retries",
    });
  }
}

export const db = new AppDB();
