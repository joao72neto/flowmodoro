import { useState, useMemo, useEffect } from "react";
import type { CreateTagType, TagType } from "../tags.types";

let mockTags: TagType[] = [
  { id: 1, name: "Estudo", projectId: 1 },
  { id: 2, name: "Prática", projectId: 1 },
  { id: 3, name: "Feature A", projectId: 2 },
  { id: 4, name: "Bugfix", projectId: 2 },
  { id: 5, name: "Teoria", projectId: 3 },
  { id: 6, name: "Exercício", projectId: 3 },
  { id: 7, name: "Refatoração", projectId: 4 },
];

export const useTags = (projectId: number) => {
  const [tags, setTagsState] = useState<TagType[]>(mockTags);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery("");
  }, [projectId]);

  const setTags = (newTags: TagType[]) => {
    mockTags = newTags;
    setTagsState(newTags);
  };

  const handleCreateTag = (tag: CreateTagType | TagType) => {
    const nextId =
      mockTags.length > 0 ? Math.max(...mockTags.map((t) => t.id)) + 1 : 1;
    setTags([{ id: nextId, name: tag.name, projectId }, ...mockTags]);
  };

  const handleDeleteTag = (id: number) => {
    setTags(mockTags.filter((item) => item.id !== id));
  };

  const handleEditTag = (tag: TagType) => {
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
