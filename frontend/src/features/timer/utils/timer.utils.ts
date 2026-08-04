import { getTick } from "./timer-tick.store";
import { updateFaviconWithTime } from "../../../shared/utils/favicon.utils";
import { resetFavicon } from "../../../shared/utils/favicon.utils";
import type { TimerMode } from "../timer.types";

export const updateFavicon = (mode: TimerMode) => {
  const currentSeconds = getTick();
  const faviconTime =
    currentSeconds < 60
      ? currentSeconds.toString()
      : Math.floor(currentSeconds / 60).toString();

  if (mode === "focus") {
    updateFaviconWithTime({
      time: faviconTime,
      color: "#f59e0b",
      textColor: "#222",
    });
  } else if (mode === "break") {
    updateFaviconWithTime({
      time: faviconTime,
      color: "#22c55e",
      textColor: "#000000",
    });
  } else {
    resetFavicon();
  }
};

export const sendNotification = async () => {
  if (Notification.permission !== "granted") return;

  const notificationData = {
    body: "Sua pausa acabou. Hora de voltar ao foco!",
    icon: "/flowmodoro-icon.svg",
    vibrate: [200, 100, 200],
    tag: "break-finished",
    requireInteraction: true,
  };

  try {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(
        "Pausa Finalizada!",
        notificationData,
      );
    } else {
      new Notification("Pausa Finalizada!", notificationData);
    }
  } catch (error) {
    console.error("Error showing notification:", error);
  }
};
