import { useSyncExternalStore } from "react";

import { subscribe, getSeconds } from "../timer.store";

export function useSeconds() {
  return useSyncExternalStore(subscribe, getSeconds);
}
