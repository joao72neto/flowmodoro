import { DEFAULT_PROJECT } from "../consts/default-project";
import type { ProjectModel } from "../project.model";
import type { ProjectUpdateDTO } from "../../dtos/projects-request";

export const applyUpdates = ({
  id,
  old,
  updated,
}: {
  id: string;
  old?: ProjectModel;
  updated?: ProjectUpdateDTO;
}): ProjectModel => {
  return {
    id,
    name: updated?.name || old?.name || DEFAULT_PROJECT.name,
    createdAt: old?.createdAt || DEFAULT_PROJECT.createdAt,
  };
};
