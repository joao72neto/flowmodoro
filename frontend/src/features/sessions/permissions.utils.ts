import { FlowmodoroPlugin } from "../../mobile/plugins";

export async function ensureAllPermissions(): Promise<boolean> {
  const [notification, exactAlarm, battery] = await Promise.all([
    FlowmodoroPlugin.ensureNotificationPermission(),
    FlowmodoroPlugin.ensureExactAlarmPermission(),
    FlowmodoroPlugin.ensureBatteryOptimization(),
  ]);

  return notification.granted && exactAlarm.granted && battery.granted;
}
