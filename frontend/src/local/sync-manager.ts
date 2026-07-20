import sessions from "../features/sessions/sync-sessions";
import projects from "../features/projects/sync-projects";
import tags from "../features/tags/sync-tags";

export function initSync() {
  window.addEventListener("online", () => {
    sessions.syncSessions();
    projects.syncSessions();
    tags.syncTags();
  });

  if (navigator.onLine) {
    sessions.syncSessions();
    projects.syncSessions();
    tags.syncTags();
  }
}

export function triggerSync() {
  window.dispatchEvent(new Event("online"));
}
