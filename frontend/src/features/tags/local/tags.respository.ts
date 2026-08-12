import { db } from "../../../local/indexedDB";

import type { TagDTO } from "../dtos/tags-response";
import type { TagPayloadDTO, TagUpdateDTO } from "../dtos/tags-request";

import type { TagModel } from "./tag.model";
import { applyUpdates } from "./utils/apply-updates";

import mapper from "../tags.mappers";

import syncQueue from "../../../local/sync/sync-queue.service";
import { sumFocusBy } from "../../../shared/utils/sum-focus-by/sum-focus-by.util";

export const fetchTagsByProject = async (
  projectId: string,
): Promise<TagDTO[]> => {
  const [tags, sessions] = await Promise.all([
    db.tags.where("projectId").equals(projectId).reverse().toArray(),
    db.sessions.toArray(),
  ]);

  const focusPerTag = sumFocusBy(sessions, (session) => session.tagId);

  return tags
    .map((tag) => ({
      ...tag,
      totalFocus: focusPerTag[tag.id] || 0,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

export const createTag = async (payload: TagPayloadDTO): Promise<TagDTO> => {
  const tag: TagModel = mapper.fromPayload(payload);

  await db.tags.add(tag);

  const saveToQueue = mapper.toPayload(tag);
  await syncQueue.addToQueue({
    entityType: "tag",
    action: "CREATE",
    payload: saveToQueue,
  });
  return mapper.fromModel(tag);
};

export const updateTag = async ({
  id,
  data,
}: {
  id: string;
  data: TagUpdateDTO;
}) => {
  const old = await db.tags.get(id);
  if (!old) throw new Error("Tag not found locally");

  const updatedTag: TagModel = applyUpdates({
    id,
    old,
    updated: data,
  });

  await db.tags.update(id, updatedTag);

  const saveToQueue = mapper.toPayload(updatedTag);
  await syncQueue.addToQueue({
    entityType: "tag",
    action: "UPDATE",
    payload: saveToQueue,
  });

  return mapper.fromModel(updatedTag);
};

export const deleteTag = async (id: string) => {
  const tag = await db.tags.get(id);
  if (!tag) return;

  const saveToQueue = mapper.toPayload(tag);
  await syncQueue.addToQueue({
    entityType: "tag",
    action: "DELETE",
    payload: saveToQueue,
  });

  await db.tags.delete(id);
};
