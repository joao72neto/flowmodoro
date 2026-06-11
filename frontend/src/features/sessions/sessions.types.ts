export interface ISessionGroup {
  name: string;
  totalFocus: number;
  totalRest: number;
  sessions: SessionResponse[];
}

export interface ISessionGroupResponse {
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

export interface CreateSessionRequest {
  focus: number;
  name?: string;
  ratio?: number;
  rest?: number;
}

export interface UpdateSessionRequest {
  name: string;
  focus?: number;
  ratio?: number;
  rest?: number;
}
