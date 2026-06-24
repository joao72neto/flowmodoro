export interface ISessionGroup {
  name: string;
  totalFocus: number;
  totalRest: number;
  sessions: SessionResponse[];
}

export interface SessionGroupResponse {
  date: string;
  totalFocus: number;
  totalRest: number;
  sessionGroups: ISessionGroup[];
}

export interface SessionResponse {
  id: number;
  name: string;
  focus: number;
  rest: number;
  ratio: number;
}

export interface SessionPayload {
  focus?: number;
  name?: string;
  ratio?: number;
  rest?: number;
  projectId?: number;
  tagId?: number;
}
