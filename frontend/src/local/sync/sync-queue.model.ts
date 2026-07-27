import type { SessionPayloadDTO } from "../../features/sessions/dtos/sessions-request";
import type { ProjectPayloadDTO } from "../../features/projects/dtos/projects-request";
import type { TagPayloadDTO } from "../../features/tags/dtos/tags-request";

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
  payload: TagPayloadDTO;
};

export type SyncQueueModel = {
  id?: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  status: "pending" | "processing" | "failed";
  timestamp: Date;
  retries: number;
  error?: string;
  nextAttemptAt?: Date;
} & (SessionSyncItem | ProjectSyncItem | TagSyncItem);
