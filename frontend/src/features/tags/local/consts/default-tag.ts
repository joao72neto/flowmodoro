import type { TagModel } from "../tag.model";

export const DEFAULT_TAG: TagModel = {
  id: crypto.randomUUID(),
  name: "Tag padrão",
  projectId: "",
  createdAt: new Date().toISOString(),
};
