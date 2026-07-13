import syncSessions from "../features/sessions/sync-sessions";

export function initSync() {
  window.addEventListener("online", () => {
    void syncSessions.syncCreateSession();
  });

  if (navigator.onLine) {
    void syncSessions.syncCreateSession();
  }
}

export function triggerSync() {
  window.dispatchEvent(new Event("online"));
}
