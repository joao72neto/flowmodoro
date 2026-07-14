export interface SessionModel {
  id: string;
  name: string;
  focus: number;
  ratio: number;
  rest: number;
  projectId?: string;
  tagId?: string;
  date: string;
  deleted: boolean;
  pending_action: "DELETE" | "UPDATE" | "CREATE" | null;
}
