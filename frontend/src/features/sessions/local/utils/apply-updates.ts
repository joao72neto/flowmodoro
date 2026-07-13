import { DEFAULT_SESSION } from "../consts/default-session";
import type { SessionPayloadDTO } from "../session.dtos";
import type { SessionModel } from "../session.model";
import { calculateRest } from "./calculate-rest";

export const applyUpdates = ({
  id,
  old,
  updated,
}: {
  id: string;
  old?: SessionModel;
  updated?: SessionPayloadDTO;
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
    pending_action:
      updated?.pending_action ||
      old?.pending_action ||
      DEFAULT_SESSION.pending_action,
  };
};
