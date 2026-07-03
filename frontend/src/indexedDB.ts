import Dexie, { type Table } from "dexie";
import type { ProjectResponse } from "./features/projects/api/projects.types";
import type { TagResponse } from "./features/tags/api/tags.types";
import type { SessionModel } from "./features/sessions/db/session.model";

class AppDB extends Dexie {
  sessions!: Table<SessionModel, string>;
  projects!: Table<ProjectResponse, string>;
  tags!: Table<TagResponse, string>;

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
