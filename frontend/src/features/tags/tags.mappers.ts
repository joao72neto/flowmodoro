import type { TagDTO } from "./dtos/tags-response";
import type {
  TagPayloadDTO,
  TagCreateDTO,
  TagUpdateBulkDTO,
} from "./dtos/tags-request";
import type { TagModel } from "./local/tag.model";

class TagMapper {
  fromModel = (tag: TagModel): TagDTO => {
    return {
      id: tag.id,
      name: tag.name,
      projectId: tag.projectId,
      totalFocus: 0,
    };
  };

  fromModelList = (tags: TagModel[]): TagDTO[] => {
    return tags.map((tag) => this.fromModel(tag));
  };

  fromPayload = (tag: TagPayloadDTO): TagModel => {
    return {
      id: crypto.randomUUID(),
      name: tag.name,
      projectId: tag.projectId,
      createdAt: new Date().toISOString(),
      deleted: false,
      pending_action: null,
    };
  };

  toPayload = (tag: TagModel): TagPayloadDTO => {
    return {
      name: tag.name,
      projectId: tag.projectId,
    };
  };

  toPayloadList = (tags: TagModel[]): TagPayloadDTO[] => {
    return tags.map((tag) => this.toPayload(tag));
  };

  toCreateDTO = (tag: TagModel): TagCreateDTO => {
    return {
      id: tag.id,
      name: tag.name,
      projectId: tag.projectId,
    };
  };

  toCreateDTOList = (tags: TagModel[]): TagCreateDTO[] => {
    return tags.map((tag) => this.toCreateDTO(tag));
  };

  toUpdateBulkDTO = (tag: TagModel): TagUpdateBulkDTO => {
    return {
      id: tag.id,
      name: tag.name,
    };
  };

  toUpdateBulkDTOList = (tags: TagModel[]): TagUpdateBulkDTO[] => {
    return tags.map((tag) => this.toUpdateBulkDTO(tag));
  };
}

export default new TagMapper();
