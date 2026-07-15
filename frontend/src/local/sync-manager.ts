import sync from "../features/sessions/sync-sessions";

export function initSync() {
  window.addEventListener("online", () => {
    sync.syncSessions();
  });

  if (navigator.onLine) {
    sync.syncSessions();
  }
}

export function triggerSync() {
  window.dispatchEvent(new Event("online"));
}
