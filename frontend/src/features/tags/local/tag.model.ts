export type TagModel = {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  deleted: boolean;
  pending_action?: "CREATE" | "UPDATE" | "DELETE" | null;
};
