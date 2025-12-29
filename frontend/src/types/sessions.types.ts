import type { TaskModel } from "./tasks.types";

export interface SessionResponse {
  focus: number;
  ratio: number;
  rest: number;
  interruptions: number;
  date: string;
  task: TaskModel;
}

export interface SessionRequest {
  focus: number;
  interruptions: number;
}
