import syncSessions from "../features/sessions/sync-sessions";

export function initSync() {
  const syncFunctions = [
    syncSessions.syncCreateSessions,
    syncSessions.syncDeleteSessions,
    syncSessions.syncUpdateSessions,
  ];

  window.addEventListener("online", () => {
    syncFunctions.forEach((fn) => void fn());
  });

  if (navigator.onLine) {
    syncFunctions.forEach((fn) => void fn());
  }
}

export function triggerSync() {
  window.dispatchEvent(new Event("online"));
}
