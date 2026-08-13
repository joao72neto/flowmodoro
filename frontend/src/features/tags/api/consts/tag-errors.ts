export type TagError = "TAG_NOT_FOUND" | "TAG_EXISTS";

export const tagErrors: Record<string, string> = {
  TAG_NOT_FOUND: "Tag não encontrada",
  TAG_EXISTS: "Tag já existe",
};
