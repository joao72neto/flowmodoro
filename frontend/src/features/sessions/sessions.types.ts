export interface ISessionGroup {
  id: string;
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
  ratio: number;
  rest: number;
  project: {
    id: number;
    name: string;
  };
  tag: {
    id: number;
    name: string;
  };
}

export interface SessionPayload {
  focus?: number;
  name?: string;
  ratio?: number;
  rest?: number;
  projectId?: number;
  tagId?: number;
}
