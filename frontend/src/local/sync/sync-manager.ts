import sessions from "../../features/sessions/sync-sessions";
import projects from "../../features/projects/sync-projects";
import tags from "../../features/tags/sync-tags";

export const initSync = async () => {
  window.addEventListener("online", async () => {
    await projects.syncSessions();
    await tags.syncTags();
    await sessions.syncSessions();
  });

  if (navigator.onLine) {
    await projects.syncSessions();
    await tags.syncTags();
    await sessions.syncSessions();
  }
};

export const triggerSync = () => {
  window.dispatchEvent(new Event("online"));
};
