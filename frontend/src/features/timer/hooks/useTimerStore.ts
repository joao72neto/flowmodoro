import { useSyncExternalStore } from "react";

import { subscribe, getSeconds, getTotalFocus, getRatio } from "../timer.store";

export function useSeconds() {
  return useSyncExternalStore(subscribe, getSeconds);
}

export function useTotalFocus() {
  return useSyncExternalStore(subscribe, getTotalFocus);
}

export function useRatio() {
  return useSyncExternalStore(subscribe, getRatio);
}
