import { db } from "../../../indexedDB";
import type { TagPayload } from "../api/tags.types";
import { DEFAULT_TAG } from "./consts/default-tag";
import type { TagModel } from "./tag.model";

export const fetchLocalTagsByProject = async (
  projectId: number,
): Promise<TagModel[]> => {
  return db.tags.filter((tag) => tag.projectId === projectId).toArray();
};

export const createLocalTag = async (
  payload: TagPayload,
): Promise<TagModel> => {
  const tag: TagModel = {
    id: crypto.randomUUID(),
    name: payload.name || DEFAULT_TAG.name,
    projectId: payload.projectId || DEFAULT_TAG.projectId,
  };

  await db.tags.add(tag);

  return tag;
};

export const updateLocalTag = async ({
  id,
  data,
}: {
  id: string;
  data: TagPayload;
}) => {
  const oldTag = await db.tags.get(id);

  const updatedTag: TagModel = {
    id,
    name: data.name || oldTag?.name || DEFAULT_TAG.name,
    projectId: data.projectId || oldTag?.projectId || DEFAULT_TAG.projectId,
  };

  await db.tags.update(id, data);

  return updatedTag;
};

export const deleteLocalTag = async (id: string) => {
  await db.tags.delete(id);
};
