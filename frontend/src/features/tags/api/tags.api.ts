import api from "../../../configs/api.configs";
import type { TagDTO } from "../dtos/tags-response";
import type { TagPayloadDTO } from "../dtos/tags-request";

export const fetchTagsByProject = async (
  projectId: number,
): Promise<TagDTO[]> => {
  const res = await api.get<TagDTO[]>("/tags", {
    params: { projectId },
  });

  return res.data;
};

export const createTag = async (data: TagPayloadDTO): Promise<TagDTO> => {
  const res = await api.post<TagDTO>("/tags", data);
  return res.data;
};

export const updateTag = async ({
  id,
  data,
}: {
  id: number;
  data: TagPayloadDTO;
}): Promise<TagDTO> => {
  const res = await api.put<TagDTO>(`/tags/${id}`, data);
  return res.data;
};

export const deleteTag = async (id: number): Promise<void> => {
  await api.delete(`/tags/${id}`);
};

export const createTags = async ({
  data,
  projectId,
}: {
  data: TagPayloadDTO[];
  projectId: string;
}): Promise<TagDTO[]> => {
  const res = await api.post<TagDTO[]>("/tags/bulk", data, {
    params: { projectId },
  });
  return res.data;
};

export const updateTags = async (data: TagPayloadDTO[]): Promise<TagDTO[]> => {
  const res = await api.put<TagDTO[]>("/tags/bulk", data);
  return res.data;
};

export const deleteTags = async (ids: string[]): Promise<void> => {
  await api.delete("/tags/bulk", { data: ids });
};
