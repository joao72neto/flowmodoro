import { useCallback } from "react";
import alarmService from "./alarm.service";
import { LocalNotifications } from "@capacitor/local-notifications";

const useAlarm = () => {
  const playAlarm = useCallback((targetTime: Date) => {
    LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "⏰ Acabou a mamata!",
          body: "Toque para desligar o alarme.",
          schedule: { at: targetTime },
          sound: "alarm.wav",
          ongoing: true,
          actionTypeId: "OPEN_APP",
        },
      ],
    });

    alarmService.playLoop();
  }, []);

  const stopAlarm = useCallback(() => {
    alarmService.stop();
    LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  }, []);

  return {
    playAlarm,
    stopAlarm,
  };
};

export default useAlarm;
