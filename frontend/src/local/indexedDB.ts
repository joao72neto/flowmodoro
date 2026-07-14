import Dexie, { type Table } from "dexie";
import type { SessionModel } from "../features/sessions/local/session.model";
import type { ProjectModel } from "../features/projects/local/project.model";
import type { TagModel } from "../features/tags/local/tag.model";

class AppDB extends Dexie {
  sessions!: Table<SessionModel, string>;
  projects!: Table<ProjectModel, string>;
  tags!: Table<TagModel, string>;

  constructor() {
    super("flowmodoro-db");

    this.version(7).stores({
      sessions: "id, pending_action",
      projects: "id, &name, createdAt",
      tags: "id, projectId, &name, createdAt",
    });
  }
}

export const db = new AppDB();
