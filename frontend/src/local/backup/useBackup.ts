import { useMutation, useQueryClient } from "@tanstack/react-query";

import backupService from "./backup.service";
import { APP_DATA_QUERY_KEY } from "../../global-query-key";

import { triggerSync } from "../sync/sync-manager";

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
