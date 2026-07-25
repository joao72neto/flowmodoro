import api from "../../../configs/api.configs";
import type { TagDTO } from "../dtos/tags-response";
import type { TagCreateDTO, TagUpdateBulkDTO } from "../dtos/tags-request";

export const createTags = async (data: TagCreateDTO[]): Promise<TagDTO[]> => {
  const res = await api.post<TagDTO[]>("/tags/bulk", data, {});
  return res.data;
};

export const updateTags = async (
  data: TagUpdateBulkDTO[],
): Promise<TagDTO[]> => {
  const res = await api.put<TagDTO[]>("/tags/bulk", data);
  return res.data;
};

export const deleteTags = async (ids: string[]): Promise<void> => {
  await api.delete("/tags/bulk", { data: ids });
};
