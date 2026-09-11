export type TagDTO = {
  id: string;
  name: string;
  projectId: string;
  totalFocus: number;
  updatedAt?: string;
  deletedAt?: string | null;
};
