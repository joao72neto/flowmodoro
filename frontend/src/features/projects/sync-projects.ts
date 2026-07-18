import { db } from "../../local/indexedDB";
import type { ProjectModel } from "./local/project.model";
import type { ProjectPayloadDTO } from "./dtos/projects-request";
import { createProjects, deleteProjects } from "./api/projects.api";

import mapper from "./projects.mappers";

class SyncProjects {
  async syncSessions() {
    await this.syncCreateProjects();
    await this.syncDeleteProjects();
  }

  async syncCreateProjects() {
    const projects: ProjectModel[] = await db.projects
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (projects.length === 0) return;

    const payload: ProjectPayloadDTO[] = mapper.fromModelList(projects);
    await createProjects(payload);

    await db.projects.bulkPut(
      projects.map((s) => ({ ...s, pending_action: null })),
    );
  }

  async syncDeleteProjects() {
    const projects: ProjectModel[] = await db.projects
      .where("pending_action")
      .equals("DELETE")
      .toArray();

    if (projects.length === 0) return;

    const ids = projects.map((s) => s.id);

    await deleteProjects(ids);
    await db.projects.bulkDelete(ids);
  }
}
export default new SyncProjects();
