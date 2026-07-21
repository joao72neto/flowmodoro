import type { PendingActionType } from "../../../shared/types/pending-action.types";

export type TagModel = {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  deleted: boolean;
  pending_action?: PendingActionType;
};
