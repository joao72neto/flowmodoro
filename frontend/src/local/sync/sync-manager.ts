import syncQueue from "./sync-queue.service";

export const initSync = async () => {
  const process = () => syncQueue.processQueue();

  window.addEventListener("online", process);

  if (navigator.onLine) {
    await process();
  }
};

export const triggerSync = () => {
  window.dispatchEvent(new Event("online"));
};
