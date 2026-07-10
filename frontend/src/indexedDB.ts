import Dexie, { type Table } from "dexie";
import type { SessionModel } from "./features/sessions/offline/session.model";
import type { ProjectModel } from "./features/projects/offline/project.model";
import type { TagModel } from "./features/tags/offline/tag.model";

class AppDB extends Dexie {
  sessions!: Table<SessionModel, string>;
  projects!: Table<ProjectModel, string>;
  tags!: Table<TagModel, string>;

  constructor() {
    super("flowmodoro-db");

    this.version(5).stores({
      sessions: "id",
      projects: "id, &name, createdAt",
      tags: "id, projectId, &name, createdAt",
    });
  }
}

export const db = new AppDB();
