import { registerPlugin } from "@capacitor/core";

export interface FlowmodoroPlugin {
  requestNotificationPermission(): Promise<void>;
  startFocus({ anchorMillis }: { anchorMillis: number }): Promise<void>;
  startBreak({
    anchorMillis,
    restDurationMillis,
    ratio,
  }: {
    anchorMillis: number;
    restDurationMillis: number;
    ratio?: number;
  }): Promise<void>;
  stopTimer(): Promise<void>;
}

export const FlowmodoroPlugin = registerPlugin<FlowmodoroPlugin>("Flowmodoro");
