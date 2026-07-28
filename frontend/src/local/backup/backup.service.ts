import { db } from "../indexedDB";

import sessionMapper from "../../features/sessions/sessions.mappers";
import projectMapper from "../../features/projects/projects.mappers";
import tagMapper from "../../features/tags/tags.mappers";

import type { BackupData } from "./backup.schema";

import { backupSchema } from "./backup.schema";

class BackupService {
  async importData(file: File): Promise<void> {
    const raw = await file.text();
    const data = this.parseAndValidate(raw);

    try {
      await db.transaction(
        "rw",
        db.projects,
        db.tags,
        db.sessions,
        async () => {
          await db.projects.bulkPut(
            projectMapper.fromPayloadList(data.projects),
          );
          await db.tags.bulkPut(tagMapper.fromPayloadList(data.tags));
          await db.sessions.bulkPut(
            sessionMapper.fromPayloadList(data.sessions),
          );
        },
      );
    } catch {
      throw new Error(
        "Não foi possível restaurar o backup. O arquivo pode estar corrompido.",
      );
    }
  }

  private parseAndValidate(raw: string): BackupData {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Arquivo inválido: não é um JSON válido.");
    }

    const result = backupSchema.safeParse(parsed);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const path = firstIssue.path.join(".");
      throw new Error(
        `Arquivo inválido: ${path ? `${path} — ` : ""}${firstIssue.message}`,
      );
    }

    return result.data;
  }
}

export default new BackupService();
