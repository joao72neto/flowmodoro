import type { ProjectPayloadDTO } from "../../features/projects/dtos/projects-request";
import type { SessionPayloadDTO } from "../../features/sessions/dtos/sessions-request";
import type { TagPayloadDTO } from "../../features/tags/dtos/tags-request";
import { db } from "../indexedDB";

import sessionMapper from "../../features/sessions/sessions.mappers";
import projectMapper from "../../features/projects/projects.mappers";
import tagMapper from "../../features/tags/tags.mappers";

type BackupData = {
  version: number;
  exportedAt: string;
  projects: ProjectPayloadDTO[];
  tags: TagPayloadDTO[];
  sessions: SessionPayloadDTO[];
};

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

    if (!this.isBackupData(parsed)) {
      throw new Error("Arquivo inválido: estrutura de backup não reconhecida.");
    }

    return parsed;
  }

  private isBackupData(value: unknown): value is BackupData {
    if (typeof value !== "object" || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
      Array.isArray(v.projects) &&
      Array.isArray(v.tags) &&
      Array.isArray(v.sessions)
    );
  }
}

export default new BackupService();
