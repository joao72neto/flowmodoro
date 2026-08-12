import { useSyncExternalStore } from "react";

import { subscribe, getSeconds, getTotalFocus } from "../timer.store";

export function useSeconds() {
  return useSyncExternalStore(subscribe, getSeconds);
}

export function useTotalFocus() {
  return useSyncExternalStore(subscribe, getTotalFocus);
}
