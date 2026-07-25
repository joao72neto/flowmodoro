import { DEFAULT_TAG } from "../consts/default-tag";
import type { TagModel } from "../tag.model";

import type { TagUpdateDTO } from "../../dtos/tags-request";

export const applyUpdates = ({
  id,
  old,
  updated,
}: {
  id: string;
  old?: TagModel;
  updated?: TagUpdateDTO;
}): TagModel => {
  return {
    id,
    name: updated?.name || old?.name || DEFAULT_TAG.name,
    projectId: updated?.projectId || old?.projectId || DEFAULT_TAG.projectId,
    createdAt: old?.createdAt || DEFAULT_TAG.createdAt,
  };
};
