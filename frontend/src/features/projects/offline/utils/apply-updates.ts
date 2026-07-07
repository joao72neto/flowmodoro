import { DEFAULT_PROJECT } from "../consts/default-project";
import type { ProjectPayloadDTO } from "../project.dtos";
import type { ProjectModel } from "../project.model";

export const applyUpdates = ({
  id,
  old,
  updated,
}: {
  id: string;
  old?: ProjectModel;
  updated?: ProjectPayloadDTO;
}): ProjectModel => {
  return {
    id,
    name: updated?.name || old?.name || DEFAULT_PROJECT.name,
  };
};
