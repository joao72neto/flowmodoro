import { useState, useMemo, useEffect } from "react";
import type { TagPayload, TagResponse } from "../tags.types";

let mockTags: TagResponse[] = [
  { id: 1, name: "Estudo", projectId: 1 },
  { id: 2, name: "Prática", projectId: 1 },
  { id: 3, name: "Feature A", projectId: 2 },
  { id: 4, name: "Bugfix", projectId: 2 },
  { id: 5, name: "Teoria", projectId: 3 },
  { id: 6, name: "Exercício", projectId: 3 },
  { id: 7, name: "Refatoração", projectId: 4 },
];

export const useTags = (projectId: number) => {
  const [tags, setTagsState] = useState<TagResponse[]>(mockTags);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery("");
  }, [projectId]);

  const setTags = (newTags: TagResponse[]) => {
    mockTags = newTags;
    setTagsState(newTags);
  };

  const handleCreateTag = (tag: TagPayload | TagResponse) => {
    const nextId =
      mockTags.length > 0 ? Math.max(...mockTags.map((t) => t.id)) + 1 : 1;
    setTags([{ id: nextId, name: tag.name, projectId }, ...mockTags]);
  };

  const handleDeleteTag = (id: number) => {
    setTags(mockTags.filter((item) => item.id !== id));
  };

  const handleEditTag = (tag: TagResponse) => {
    setTags(
      mockTags.map((item) =>
        item.id === tag.id ? { ...item, name: tag.name } : item,
      ),
    );
  };

  const filteredTags = useMemo(() => {
    return tags
      .filter((tag) => tag.projectId === projectId)
      .filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [tags, projectId, searchQuery]);

  return {
    tags: filteredTags,
    searchQuery,
    setSearchQuery,
    handleCreateTag,
    handleDeleteTag,
    handleEditTag,
  };
};
