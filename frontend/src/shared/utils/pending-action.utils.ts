import type { PendingActionType } from "../types/pending-action.types";

export const resolvePendingAction = (
  current: PendingActionType,
  incoming: "UPDATE" | "DELETE",
): PendingActionType => {
  if (current === "CREATE" && incoming === "UPDATE") {
    return "CREATE";
  }

  if (current === "CREATE" && incoming === "DELETE") {
    return "DISCARD";
  }

  if (incoming === "DELETE") {
    return "DELETE";
  }

  return "UPDATE";
};
