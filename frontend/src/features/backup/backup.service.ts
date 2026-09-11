import { db } from "../../local/indexedDB";
import type { BackupData } from "./backup.schema";
import { backupSchema } from "./backup.schema";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { localStorageKeys } from "../../shared/utils/storage.utils";
import { importBackupApi } from "./api/backup.api";
import { executePull } from "../../local/sync/pull-manager";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export class ImportPullError extends Error {
  constructor(
    message = "Os dados foram salvos no servidor com sucesso, mas a atualização local falhou.",
  ) {
    super(message);
    this.name = "ImportPullError";
  }
}

class BackupService {
  private readonly VERSION = 1;

  private getUserId(): string {
    const { id: userId } = JSON.parse(
      localStorage.getItem(localStorageKeys.authUser) || "{}",
    );
    if (!userId) {
      throw new Error("id do usuário não encontrado");
    }
    return userId;
  }

  async exportWeb(): Promise<void> {
    try {
      const [projects, tags, sessions] = await Promise.all([
        db.projects.toArray(),
        db.tags.toArray(),
        db.sessions.toArray(),
      ]);

      const userId = this.getUserId();

      if (!userId) {
        throw new Error("id do usuário não encontrado");
      }

      const backup: BackupData = {
        userId,
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

  async exportNative(): Promise<void> {
    try {
      const [projects, tags, sessions] = await Promise.all([
        db.projects.toArray(),
        db.tags.toArray(),
        db.sessions.toArray(),
      ]);

      const userId = this.getUserId();

      if (!userId) {
        throw new Error("id do usuário não encontrado");
      }

      const backup: BackupData = {
        userId,
        version: this.VERSION,
        exportedAt: new Date().toISOString(),
        projects,
        tags,
        sessions,
      };

      const fileName = `flowmodoro-backup-${this.formatDateForFilename(new Date())}.json`;
      const content = JSON.stringify(backup, null, 2);

      const result = await Filesystem.writeFile({
        path: fileName,
        data: content,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      await Share.share({
        title: "Backup do Flowmodoro",
        text: "Backup dos seus dados do Flowmodoro",
        url: result.uri,
        dialogTitle: "Salvar backup",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Não foi possível gerar o backup. Tente novamente.");
    }
  }

  async importData(file: File): Promise<void> {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        "Arquivo muito grande. O tamanho máximo permitido é de 5MB.",
      );
    }

    const raw = await file.text();
    const data = this.parseAndValidate(raw);

    // 1. Envia o payload completo para a API no backend
    await importBackupApi(data);

    // 2. Reseta o lastSync para forçar pull completo
    localStorage.removeItem(localStorageKeys.lastSync);

    // 3. Executa o pull para sincronizar o IndexedDB local
    try {
      await executePull();
    } catch (pullErr) {
      console.error(
        "Importação salva no servidor, mas falha no pull local:",
        pullErr,
      );
      throw new ImportPullError();
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

    if (result.data?.userId !== this.getUserId()) {
      throw new Error("id do usuário não corresponde ao id do usuário logado");
    }

    return result.data;
  }

  private formatDateForFilename(date: Date): string {
    return date.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  }
}

export default new BackupService();
