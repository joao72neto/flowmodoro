import Dexie, { type Table } from "dexie";
import type { SessionResponse } from "./features/sessions/sessions.types";
import type { ProjectResponse } from "./features/projects/projects.types";
import type { TagResponse } from "./features/tags/tags.types";

class AppDB extends Dexie {
  sessions!: Table<SessionResponse, string>;
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
