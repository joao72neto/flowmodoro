export interface ProjectModel {
  id: string;
  name: string;
  createdAt: string;
  deleted: boolean;
  pending_action: "DELETE" | "UPDATE" | "CREATE" | null;
}
