import { registerPlugin } from "@capacitor/core";

export interface FlowmodoroPlugin {
  ensureNotificationPermission(): Promise<{ granted: boolean }>;
  ensureExactAlarmPermission(): Promise<{ granted: boolean }>;
  ensureBatteryOptimization(): Promise<{ granted: boolean }>;

  startFocus({
    anchorMillis,
    sessionName,
  }: {
    anchorMillis: number;
    sessionName: string;
  }): Promise<void>;
  startBreak({
    anchorMillis,
    totalFocusMillis,
    restRatio,
    sessionName,
  }: {
    anchorMillis: number;
    totalFocusMillis: number;
    restRatio: number;
    sessionName: string;
  }): Promise<void>;
  stopTimer(): Promise<void>;
}

export const FlowmodoroPlugin = registerPlugin<FlowmodoroPlugin>("Flowmodoro");
