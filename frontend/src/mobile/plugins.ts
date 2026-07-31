import { registerPlugin } from "@capacitor/core";

export interface FlowmodoroPlugin {
  startTimer(): Promise<void>;
  stopTimer(): Promise<void>;
}

export const FlowmodoroPlugin = registerPlugin<FlowmodoroPlugin>("Flowmodoro");
