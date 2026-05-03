export interface ITaskGroup {
  task: {
    id: number;
    name: string;
    checked: boolean;
  };
  taskTotalFocus: number;
  taskTotalRest: number;
  sessions: SessionResponse[];
}

export interface ISessionGroupResponse {
  date: string;
  totalFocus: number;
  totalRest: number;
  taskGroups: ITaskGroup[];
}

export interface SessionResponse {
  id: number;
  name: string;
  focus: number;
  rest: number;
  ratio: number;
  interruptions: number;
  task?: {
    id: number;
    name: string;
  };
}

export interface SessionRequest {
  focus: number;
  interruptions: number;
  ratio?: number;
}
