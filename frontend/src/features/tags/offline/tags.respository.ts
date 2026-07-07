import { db } from "../../../indexedDB";

import type { TagDTO, TagPayloadDTO } from "./tag.dtos";
import type { TagModel } from "./tag.model";
import { modelToDTO, modelToDTOArray, payloadToModel } from "./tags.mappers";
import { applyUpdates } from "./utils/apply-updates";

export const fetchLocalTagsByProject = async (
  projectId: string,
): Promise<TagDTO[]> => {
  const tags = await db.tags.where("projectId").equals(projectId).toArray();
  return modelToDTOArray(tags);
};

export const createLocalTag = async (
  payload: TagPayloadDTO,
): Promise<TagDTO> => {
  const tag: TagModel = payloadToModel(payload);

  await db.tags.add(tag);

  return modelToDTO(tag);
};

export const updateLocalTag = async ({
  id,
  data,
}: {
  id: string;
  data: TagPayloadDTO;
}) => {
  const old = await db.tags.get(id);

  const updatedTag: TagModel = applyUpdates({ id, old, updated: data });

  await db.tags.update(id, data);

  return modelToDTO(updatedTag);
};

export const deleteLocalTag = async (id: string) => {
  await db.tags.delete(id);
};
