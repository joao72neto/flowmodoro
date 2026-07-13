export interface CreateSessionDTO {
  id: string;
  focus: number;
  name: string;
  ratio?: number;
  rest?: number;
  projectId?: string;
  tagId?: string;
}

export interface SessionPayloadDTO {
  focus: number;
  name: string;
  ratio?: number;
  rest?: number;
  projectId?: string;
  tagId?: string;
  pending_action?: "DELETE" | "UPDATE" | "CREATE" | null;
}
