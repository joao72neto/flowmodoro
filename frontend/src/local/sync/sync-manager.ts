import syncQueue from "./sync-queue.service";

const SYNC_EVENT = "sync-queue:trigger";

export const initSync = () => {
  syncQueue.init();
  const process = () => syncQueue.processQueue();

  window.addEventListener("online", process);

  window.addEventListener(SYNC_EVENT, process);

  setInterval(process, 30_000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") process();
  });

  if (navigator.onLine) process();
};

export const triggerSync = () => {
  window.dispatchEvent(new Event(SYNC_EVENT));
};
