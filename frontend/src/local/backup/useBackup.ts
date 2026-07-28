import { useState, useCallback, useEffect } from "react";

import backupService from "./backup.service";

type BackupAction = "upload" | "download" | null;

const ERROR_DISMISS_MS = 5000;

export function useBackup() {
  const [loadingAction, setLoadingAction] = useState<BackupAction>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => setError(null), ERROR_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [error]);

  const upload = useCallback(async (file: File) => {
    setError(null);
    setLoadingAction("upload");
    try {
      await backupService.importData(file);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado ao importar.",
      );
    } finally {
      setLoadingAction(null);
    }
  }, []);

  return {
    upload,
    isUploading: loadingAction === "upload",
    isDownloading: loadingAction === "download",
    error,
    clearError: () => setError(null),
  };
}
