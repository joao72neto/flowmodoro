import type { TagModel } from "../tag.model";
import { v4 as uuidv4 } from "uuid";

export const DEFAULT_TAG: TagModel = {
  id: uuidv4(),
  name: "Tag padrão",
  projectId: "",
  createdAt: new Date().toISOString(),
};
