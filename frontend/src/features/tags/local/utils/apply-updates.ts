import { DEFAULT_TAG } from "../consts/default-tag";
import type { TagModel } from "../tag.model";

import type { TagPayloadDTO } from "../../dtos/tags-request";
import type { PendingActionType } from "../../../../shared/types/pending-action.types";

export const applyUpdates = ({
  id,
  old,
  updated,
  pending_action,
}: {
  id: string;
  old?: TagModel;
  updated?: TagPayloadDTO;
  pending_action: PendingActionType;
}): TagModel => {
  return {
    id,
    name: updated?.name || old?.name || DEFAULT_TAG.name,
    projectId: updated?.projectId || old?.projectId || DEFAULT_TAG.projectId,
    createdAt: old?.createdAt || DEFAULT_TAG.createdAt,
    deleted: false,
    pending_action,
  };
};
