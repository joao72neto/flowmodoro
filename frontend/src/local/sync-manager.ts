import sessions from "../features/sessions/sync-sessions";
import projects from "../features/projects/sync-projects";

export function initSync() {
  window.addEventListener("online", () => {
    sessions.syncSessions();
    projects.syncSessions();
  });

  if (navigator.onLine) {
    sessions.syncSessions();
    projects.syncSessions();
  }
}

export function triggerSync() {
  window.dispatchEvent(new Event("online"));
}
