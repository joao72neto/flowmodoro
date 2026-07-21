import { db } from "../../../local/indexedDB";

import type { TagDTO } from "../dtos/tags-response";
import type { TagPayloadDTO } from "../dtos/tags-request";

import type { TagModel } from "./tag.model";
import { applyUpdates } from "./utils/apply-updates";

import mapper from "../tags.mappers";
import { resolvePendingAction } from "../../../shared/utils/pending-action.utils";

export const fetchTagsByProject = async (
  projectId: string,
): Promise<TagDTO[]> => {
  const [tags, sessions] = await Promise.all([
    db.tags
      .where("projectId")
      .equals(projectId)
      .reverse()
      .filter((t) => !t.deleted)
      .toArray(),

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

export const createTag = async (payload: TagPayloadDTO): Promise<TagDTO> => {
  const tag: TagModel = {
    ...mapper.fromPayload(payload),
    pending_action: "CREATE",
  };

  await db.tags.add(tag);
  return mapper.fromModel(tag);
};

export const updateTag = async ({
  id,
  data,
}: {
  id: string;
  data: TagPayloadDTO;
}) => {
  const old = await db.tags.get(id);
  if (!old) throw new Error("Tag not found locally");

  const resolvedAction = resolvePendingAction(
    old.pending_action ?? null,
    "UPDATE",
  );
  const pending_action = resolvedAction;

  const updatedTag: TagModel = applyUpdates({
    id,
    old,
    updated: data,
    pending_action,
  });

  await db.tags.update(id, updatedTag);
  return mapper.fromModel(updatedTag);
};

export const deleteTag = async (id: string) => {
  const tag = await db.tags.get(id);
  if (!tag) return;

  const resolvedAction = resolvePendingAction(
    tag.pending_action ?? null,
    "DELETE",
  );

  if (resolvedAction === "DISCARD") {
    await db.tags.delete(id);
    return;
  }

  await db.tags.update(id, {
    deleted: true,
    pending_action: resolvedAction,
  });
};
