export interface ISessionGroupoResponse {
  date: string;
  totalFocus: number;
  totalRest: number;
  sessions: Session[];
}

export interface Session {
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
}
