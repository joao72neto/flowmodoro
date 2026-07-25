import type { SessionPayloadDTO } from "../../features/sessions/dtos/sessions-request";
import type { ProjectPayloadDTO } from "../../features/projects/dtos/projects-request";
import type { TagCreateDTO } from "../../features/tags/dtos/tags-request";

export type SessionSyncItem = {
  entityType: "session";
  payload: SessionPayloadDTO;
};

export type ProjectSyncItem = {
  entityType: "project";
  payload: ProjectPayloadDTO;
};

export type TagSyncItem = {
  entityType: "tag";
  payload: TagCreateDTO;
};

export type SyncQueueModel = {
  id?: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  status: "pending" | "processing" | "failed";
  timestamp: Date;
  retries: number;
  error?: string;
} & (SessionSyncItem | ProjectSyncItem | TagSyncItem);
