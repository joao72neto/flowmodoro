import { registerPlugin } from "@capacitor/core";

export interface FlowmodoroPlugin {
  ensureNotificationPermission(): Promise<{ granted: boolean }>;
  ensureExactAlarmPermission(): Promise<{ granted: boolean }>;
  ensureBatteryOptimization(): Promise<{ granted: boolean }>;

  startFocus({ anchorMillis }: { anchorMillis: number }): Promise<void>;
  startBreak({
    anchorMillis,
    totalFocusMillis,
    restRatio,
  }: {
    anchorMillis: number;
    totalFocusMillis: number;
    restRatio: number;
  }): Promise<void>;
  stopTimer(): Promise<void>;
}

export const FlowmodoroPlugin = registerPlugin<FlowmodoroPlugin>("Flowmodoro");
