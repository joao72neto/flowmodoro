import { Network } from "@capacitor/network";

import syncQueue from "./sync-queue.service";
import { executePull } from "./pull-manager";
import { isNative } from "../../consts/platform";
import { localStorageKeys } from "../../shared/utils/storage.utils";
import { AUTH_CHANGE_EVENT } from "../../shared/contexts/auth/auth.provider";

const SYNC_EVENT = "sync-queue:trigger";
export const PULL_COMPLETED_EVENT = "sync:completed";

const isUserAuthenticated = (): boolean => {
  try {
    const user = localStorage.getItem(localStorageKeys.authUser);
    return user !== null;
  } catch {
    return false;
  }
};

export const initSync = () => {
  syncQueue.init();
  const process = () => {
    if (!isUserAuthenticated()) return;
    syncQueue.processQueue();
  };

  if (isNative) {
    Network.addListener("networkStatusChange", (status) => {
      if (status.connected) process();
    });

    Network.getStatus().then((status) => {
      if (status.connected) process();
    });
  } else {
    window.addEventListener("online", process);

    if (navigator.onLine) process();
  }

  window.addEventListener(SYNC_EVENT, process);

  setInterval(process, 30_000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") process();
  });

  window.addEventListener(AUTH_CHANGE_EVENT, async () => {
    if (isUserAuthenticated()) {
      try {
        await executePull();
        window.dispatchEvent(new Event(PULL_COMPLETED_EVENT));
      } catch (err) {
        console.error("Falha no pull, prosseguindo com offline push", err);
      }
      process();
    }
  });
};

export const triggerSync = () => {
  window.dispatchEvent(new Event(SYNC_EVENT));
};
