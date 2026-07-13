export interface DailySessionsDTO {
  date: string;
  totalFocus: number;
  totalRest: number;
  sessionGroups: SessionGroupDTO[];
}

export interface SessionGroupDTO {
  id: string;
  name: string;
  totalFocus: number;
  totalRest: number;
  sessions: SessionDTO[];
}

export interface SessionDTO {
  id: string;
  name: string;
  focus: number;
  rest: number;
  ratio: number;
  date: string;
  project: {
    id: string;
    name: string;
  };
  tag: {
    id: string;
    name: string;
  };
}

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
