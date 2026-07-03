import Dexie, { type Table } from "dexie";

import type { SessionModel } from "./features/sessions/db/session.model";
import type { ProjectModel } from "./features/projects/db/project.model";
import type { TagModel } from "./features/tags/db/tag.model";

class AppDB extends Dexie {
  sessions!: Table<SessionModel, string>;
  projects!: Table<ProjectModel, string>;
  tags!: Table<TagModel, string>;

  constructor() {
    super("flowmodoro-db");

    this.version(1).stores({
      sessions: "id",
      projects: "id",
      tags: "id, projectId",
    });
  }
}

export const db = new AppDB();
