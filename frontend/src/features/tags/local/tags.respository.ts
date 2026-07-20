import { db } from "../../../local/indexedDB";

import type { TagDTO } from "../dtos/tags-response";
import type { TagPayloadDTO } from "../dtos/tags-request";

import type { TagModel } from "./tag.model";
import { modelToDTO, payloadToModel } from "./tags.mappers";
import { applyUpdates } from "./utils/apply-updates";

export const fetchLocalTagsByProject = async (
  projectId: string,
): Promise<TagDTO[]> => {
  const [tags, sessions] = await Promise.all([
    db.tags.where("projectId").equals(projectId).toArray(),
    db.sessions.toArray(),
  ]);

  const focusPerTag = sessions.reduce(
    (acumulador, session) => {
      const tId = session.tagId;
      if (!tId) return acumulador;

      acumulador[tId] = (acumulador[tId] || 0) + (session.focus || 0);
      return acumulador;
    },
    {} as Record<string, number>,
  );

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
