import { DEFAULT_PROJECT } from "../consts/default-project";
import type { ProjectModel } from "../project.model";
import type { ProjectUpdateDTO } from "../../dtos/projects-request";
import type { PendingActionType } from "../../../../shared/types/pending-action.types";

export const applyUpdates = ({
  id,
  old,
  updated,
  pending_action,
}: {
  id: string;
  old?: ProjectModel;
  updated?: ProjectUpdateDTO;
  pending_action: PendingActionType;
}): ProjectModel => {
  return {
    id,
    name: updated?.name || old?.name || DEFAULT_PROJECT.name,
    createdAt: old?.createdAt || DEFAULT_PROJECT.createdAt,
    deleted: false,
    pending_action,
  };
};
