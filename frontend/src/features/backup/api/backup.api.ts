import api from "../../../configs/api.configs";
import type { BackupData } from "../backup.schema";

export const importBackupApi = async (data: BackupData): Promise<void> => {
  await api.post("/backup/import", data);
};
