import { Network } from "@capacitor/network";

import syncQueue from "./sync-queue.service";
import { isNative } from "../../consts/platform";

const SYNC_EVENT = "sync-queue:trigger";

export const initSync = () => {
  return;
  syncQueue.init();
  const process = () => syncQueue.processQueue();

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
};

export const triggerSync = () => {
  window.dispatchEvent(new Event(SYNC_EVENT));
};
