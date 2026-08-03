import { registerPlugin } from "@capacitor/core";

export interface FlowmodoroPlugin {
  requestNotificationPermission(): Promise<void>;
  startFocus(): Promise<void>;
  startBreak({
    focusDurationMillis,
    ratio,
  }: {
    focusDurationMillis: number;
    ratio?: number;
  }): Promise<void>;
  stopTimer(): Promise<void>;
}

export const FlowmodoroPlugin = registerPlugin<FlowmodoroPlugin>("Flowmodoro");
