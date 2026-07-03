import api from "../../../configs/api.configs";
import type { TagPayload, TagResponse } from "./tags.types";

export const fetchTagsByProject = async (
  projectId: number,
): Promise<TagResponse[]> => {
  const res = await api.get<TagResponse[]>("/tags", {
    params: { projectId },
  });

  return res.data;
};

export const createTag = async (data: TagPayload): Promise<TagResponse> => {
  const res = await api.post<TagResponse>("/tags", data);
  return res.data;
};

export const updateTag = async ({
  id,
  data,
}: {
  id: number;
  data: TagPayload;
}): Promise<TagResponse> => {
  const res = await api.put<TagResponse>(`/tags/${id}`, data);
  return res.data;
};

export const deleteTag = async (id: number): Promise<void> => {
  await api.delete(`/tags/${id}`);
};
