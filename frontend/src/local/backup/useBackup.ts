import { useMutation, useQueryClient } from "@tanstack/react-query";

import backupService from "./backup.service";
import { APP_DATA_QUERY_KEY } from "../../consts/global-query-key";

import { triggerSync } from "../sync/sync-manager";

export const useExportBackup = () => {
  return useMutation({
    mutationFn: (): Promise<void> => backupService.exportData(),
    meta: {
      errorTitle: "Erro ao exportar backup",
    },
  });
};

export const useImportBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File): Promise<void> => backupService.importData(file),

    meta: {
      errorTitle: "Erro ao importar backup",
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      triggerSync();
    },
  });
};
