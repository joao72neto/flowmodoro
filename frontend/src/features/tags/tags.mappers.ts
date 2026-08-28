import type { TagDTO } from "./dtos/tags-response";
import type {
  TagUpdateDTO,
  TagPayloadDTO,
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
      id: tag.id,
      name: tag.name,
      projectId: tag.projectId,
      createdAt: new Date().toISOString(),
    };
  };

  fromPayloadList = (tags: TagPayloadDTO[]): TagModel[] => {
    return tags.map((tag) => this.fromPayload(tag));
  };

  toUpdateDTO = (tag: TagModel): TagUpdateDTO => {
    return {
      name: tag.name,
      projectId: tag.projectId,
    };
  };

  toPayload = (tag: TagModel): TagPayloadDTO => {
    return {
      id: tag.id,
      name: tag.name,
      projectId: tag.projectId,
    };
  };

  toUpdateBulkDTO = (tag: TagModel): TagUpdateBulkDTO => {
    return {
      id: tag.id,
      name: tag.name,
      projectId: tag.projectId,
    };
  };

  fromDTO = (dto: TagDTO): TagModel => ({
    id: dto.id,
    name: dto.name,
    projectId: dto.projectId,
    createdAt: dto.updatedAt || new Date().toISOString(),
    updatedAt: dto.updatedAt,
    deletedAt: dto.deletedAt,
  });

  fromDTOList = (dtos: TagDTO[]): TagModel[] => {
    return dtos.map((dto) => this.fromDTO(dto));
  };
}

export default new TagMapper();
