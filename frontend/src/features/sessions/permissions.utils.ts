import { FlowmodoroPlugin } from "../../mobile/plugins";

export async function ensureAllPermissions(): Promise<boolean> {
  const notification = await FlowmodoroPlugin.ensureNotificationPermission();

  if (!notification.granted) {
    return false;
  }

  const exactAlarm = await FlowmodoroPlugin.ensureExactAlarmPermission();

  if (!exactAlarm.granted) {
    return false;
  }

  const battery = await FlowmodoroPlugin.ensureBatteryOptimization();

  if (!battery.granted) {
    return false;
  }

  return true;
}
