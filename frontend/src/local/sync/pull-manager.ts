import { db } from "../indexedDB";
import { localStorageKeys } from "../../shared/utils/storage.utils";
import { pullSessions } from "../../features/sessions/api/sessions.api";
import { pullProjects } from "../../features/projects/api/projects.api";
import { pullTags } from "../../features/tags/api/tags.api";
import sessionMapper from "../../features/sessions/sessions.mappers";
import projectMapper from "../../features/projects/projects.mappers";
import tagMapper from "../../features/tags/tags.mappers";

export const executePull = async (): Promise<void> => {
  const lastSync = localStorage.getItem(localStorageKeys.lastSync);
  const syncStartTime = new Date().toISOString();

  // 1. Projects
  const apiProjects = await pullProjects(lastSync);
  if (apiProjects && apiProjects.length > 0) {
    for (const apiProject of apiProjects) {
      if (apiProject.deletedAt) {
        await db.projects.delete(apiProject.id);
      } else {
        const local = await db.projects.get(apiProject.id);
        const localUpdated = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
        const apiUpdated = apiProject.updatedAt ? new Date(apiProject.updatedAt).getTime() : 0;
        if (!local || apiUpdated >= localUpdated) {
          await db.projects.put(projectMapper.fromDTO(apiProject));
        }
      }
    }
  }

  // 2. Tags
  const apiTags = await pullTags(lastSync);
  if (apiTags && apiTags.length > 0) {
    for (const apiTag of apiTags) {
      if (apiTag.deletedAt) {
        await db.tags.delete(apiTag.id);
      } else {
        const local = await db.tags.get(apiTag.id);
        const localUpdated = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
        const apiUpdated = apiTag.updatedAt ? new Date(apiTag.updatedAt).getTime() : 0;
        if (!local || apiUpdated >= localUpdated) {
          await db.tags.put(tagMapper.fromDTO(apiTag));
        }
      }
    }
  }

  // 3. Sessions
  const apiSessions = await pullSessions(lastSync);
  if (apiSessions && apiSessions.length > 0) {
    for (const apiSession of apiSessions) {
      if (apiSession.deletedAt) {
        await db.sessions.delete(apiSession.id);
      } else {
        const local = await db.sessions.get(apiSession.id);
        const localUpdated = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
        const apiUpdated = apiSession.updatedAt ? new Date(apiSession.updatedAt).getTime() : 0;
        if (!local || apiUpdated >= localUpdated) {
          await db.sessions.put(sessionMapper.fromDTO(apiSession));
        }
      }
    }
  }

  localStorage.setItem(localStorageKeys.lastSync, syncStartTime);
};
