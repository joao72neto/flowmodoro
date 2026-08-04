import { registerPlugin } from "@capacitor/core";

export interface FlowmodoroPlugin {
  requestNotificationPermission(): Promise<void>;
  startFocus({ anchorMillis }: { anchorMillis: number }): Promise<void>;
  startBreak({
    anchorMillis,
    restDurationMillis,
  }: {
    anchorMillis: number;
    restDurationMillis: number;
  }): Promise<void>;
  stopTimer(): Promise<void>;
}

export const FlowmodoroPlugin = registerPlugin<FlowmodoroPlugin>("Flowmodoro");
