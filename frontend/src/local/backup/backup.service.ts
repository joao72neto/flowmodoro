import { db } from "../indexedDB";

import sessionMapper from "../../features/sessions/sessions.mappers";
import projectMapper from "../../features/projects/projects.mappers";
import tagMapper from "../../features/tags/tags.mappers";

import type { BackupData } from "./backup.schema";

import { backupSchema } from "./backup.schema";

class BackupService {
  private readonly VERSION = 1;

  async exportData(): Promise<void> {
    try {
      const [projects, tags, sessions] = await Promise.all([
        db.projects.toArray(),
        db.tags.toArray(),
        db.sessions.toArray(),
      ]);

      const backup: BackupData = {
        version: this.VERSION,
        exportedAt: new Date().toISOString(),
        projects,
        tags,
        sessions,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `flowmodoro-backup-${this.formatDateForFilename(new Date())}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      throw new Error("Não foi possível gerar o backup. Tente novamente.");
    }
  }

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
    } catch (err) {
      console.error(err);
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

  private formatDateForFilename(date: Date): string {
    return date.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  }
}

export default new BackupService();
