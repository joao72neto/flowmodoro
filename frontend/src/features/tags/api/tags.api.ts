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
