import type { TagDTO } from "../dtos/tags-response";
import type { TagPayloadDTO } from "../dtos/tags-request";
import type { TagModel } from "./tag.model";

export const modelToDTOArray = (tags: TagModel[]): TagDTO[] => {
  return tags.map((tag) => modelToDTO(tag));
};

export const modelToDTO = (tag: TagModel): TagDTO => {
  return {
    id: tag.id,
    name: tag.name,
    projectId: tag.projectId,
    totalFocus: 0,
  };
};

export const payloadToModel = (tag: TagPayloadDTO): TagModel => {
  return {
    id: crypto.randomUUID(),
    name: tag.name,
    projectId: tag.projectId,
    createdAt: new Date().toISOString(),
  };
};
