import { DEFAULT_SESSION } from "../consts/default-session";
import type { SessionUpdateDTO } from "../../dtos/sessions-request";
import type { SessionModel } from "../session.model";
import { calculateRest } from "./calculate-rest";

export const applyUpdates = ({
  id,
  old,
  updated,
}: {
  id: string;
  old?: SessionModel;
  updated?: SessionUpdateDTO;
}): SessionModel => {
  return {
    id,
    date: new Date().toISOString(),
    name: updated?.name || old?.name || DEFAULT_SESSION.name,
    focus: updated?.focus || old?.focus || DEFAULT_SESSION.focus,
    ratio: updated?.ratio || old?.ratio || DEFAULT_SESSION.ratio,
    rest: calculateRest(
      updated?.focus || old?.focus || DEFAULT_SESSION.focus,
      updated?.ratio || old?.ratio || DEFAULT_SESSION.ratio,
    ),
    projectId:
      updated?.projectId || old?.projectId || DEFAULT_SESSION.projectId,
    tagId: updated?.tagId || old?.tagId || DEFAULT_SESSION.tagId,
  };
};
