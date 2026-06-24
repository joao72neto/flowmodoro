import api from "../../configs/api.config";
import type { TagPayload, TagResponse } from "./tags.types";

class TagService {
  async fetchTagsByProject(projectId: number): Promise<TagResponse[]> {
    const res = await api.get<TagResponse[]>("/tags", {
      params: { projectId },
    });
    return res.data;
  }

  async createTag(data: TagPayload): Promise<TagResponse> {
    const res = await api.post<TagResponse>("/tags", data);
    return res.data;
  }

  async updateTag({
    id,
    data,
  }: {
    id: number;
    data: TagPayload;
  }): Promise<TagResponse> {
    const res = await api.put<TagResponse>(`/tags/${id}`, data);
    return res.data;
  }

  async deleteTag(id: number): Promise<void> {
    await api.delete(`/tags/${id}`);
  }
}

export default new TagService();
