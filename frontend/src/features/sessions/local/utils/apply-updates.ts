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
  const focus = updated?.focus ?? old?.focus ?? DEFAULT_SESSION.focus;
  const ratio = updated?.ratio ?? old?.ratio ?? DEFAULT_SESSION.ratio;

  return {
    id,
    date: new Date().toISOString(),
    name: updated?.name ?? old?.name ?? DEFAULT_SESSION.name,
    focus,
    ratio,
    rest: calculateRest(focus, ratio),
    projectId:
      updated?.projectId ?? old?.projectId ?? DEFAULT_SESSION.projectId,
    tagId: updated?.tagId ?? old?.tagId ?? DEFAULT_SESSION.tagId,
  };
};
