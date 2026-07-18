export interface ProjectModel {
  id: string;
  name: string;
  createdAt: string;
  pending_action: "DELETE" | "UPDATE" | "CREATE" | null;
}
