import type { PendingActionType } from "../../../shared/types/pending-action.types";

export interface ProjectModel {
  id: string;
  name: string;
  createdAt: string;
  deleted: boolean;
  pending_action: PendingActionType;
}
