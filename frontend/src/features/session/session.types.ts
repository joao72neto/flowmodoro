export interface ISessionGroupoResponse {
  date: string;
  totalFocus: number;
  totalRest: number;
  sessions: SessionResponse[];
}

export interface SessionResponse {
  id: number;
  focus: number;
  rest: number;
  ratio: number;
  interruptions: number;
  task: {
    id: number;
    name: string;
  };
}

export interface SessionRequest {
  focus: number;
  interruptions: number;
  ratio?: number;
}
