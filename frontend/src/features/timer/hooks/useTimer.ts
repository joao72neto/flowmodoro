import { useState, useEffect, useRef } from "react";

import { formatToHour } from "../../../shared/utils/number.utils";
import { localStorageKeys } from "../../../shared/utils/storage.utils";
import { useModal } from "../../../shared/contexts/modal/modal.context";
import { useSessionContext } from "../../sessions/context/sessions.context";
import type { TimerMode } from "../timer.types";

import { getRatio, setSeconds, setTotalFocus } from "../timer.store";
import { useSeconds } from "./useTimerStore";

import { MAX_BREAK_BY_RATIO } from "../consts/ratio-presets";

import { isNative } from "../../../consts/platform";

import {
  updateFaviconWithTime,
  resetFavicon,
} from "../../../shared/utils/favicon.utils";

const useTimer = () => {
  const seconds = useSeconds();

  const { handleSaveSession } = useSessionContext();
  const { showDefault, hideModal } = useModal();

  const [mode, setMode] = useState<TimerMode>(() => {
    const saved = localStorage.getItem(localStorageKeys.timer);
    return saved ? JSON.parse(saved).mode : null;
  });

  const startTimeRef = useRef<number>(Date.now());
  const baseSecondsRef = useRef<number>(seconds);

  useEffect(() => {
    localStorage.setItem(
      localStorageKeys.timer,
      JSON.stringify({ mode, seconds, lastUpdated: Date.now() }),
    );

    const faviconTime =
      seconds < 60 ? seconds.toString() : Math.floor(seconds / 60).toString();

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
  }, [mode, seconds]);

  useEffect(() => {
    const syncTime = () => {
      if (mode === "focus" || mode === "break") {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - startTimeRef.current) / 1000);

        if (mode === "focus") {
          setTotalFocus(now - startTimeRef.current);
          setSeconds(baseSecondsRef.current + diffInSeconds);
        } else if (mode === "break") {
          const remaining = baseSecondsRef.current - diffInSeconds;

          if (remaining <= 0) {
            setSeconds(0);
            setMode(null);

            if (!isNative) {
              sendNotification();
            }
          } else {
            setSeconds(remaining);
          }
        }
      }
    };

    const interval = setInterval(syncTime, 1000);
    document.addEventListener("visibilitychange", syncTime);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", syncTime);
    };
  }, [mode]);

  const startFocus = () => {
    const now = Date.now();
    startTimeRef.current = now;
    baseSecondsRef.current = 0;
    setTotalFocus(0);
    setSeconds(0);
    setMode("focus");
  };

  const calculateBreakTime = ({
    seconds,
    ratio,
  }: {
    seconds: number;
    ratio: number;
  }) => {
    const calculatedBreak = Math.round(seconds * ratio);
    const maxBreak =
      MAX_BREAK_BY_RATIO[ratio as keyof typeof MAX_BREAK_BY_RATIO];

    return maxBreak !== undefined
      ? Math.min(calculatedBreak, maxBreak)
      : calculatedBreak;
  };

  const stopFocus = () => {
    const finalFocusSeconds = seconds;
    setTotalFocus(finalFocusSeconds * 1000);
    setMode("stopped");

    const breakTime = calculateBreakTime({
      seconds: finalFocusSeconds,
      ratio: getRatio() / 100,
    });

    setSeconds(breakTime);
    baseSecondsRef.current = breakTime;
    startTimeRef.current = Date.now();

    showDefault({
      title: "Sessão Finalizada! 🎉",
      message: `Deseja salvar a sessão atual de ${formatToHour(finalFocusSeconds)}?`,
      action: () => {
        handleSaveSession({
          focusSeconds: finalFocusSeconds,
        });
      },
      cancel: () => {
        setMode(null);
        hideModal();
      },
      confirmLabel: "Salvar",
      cancelLabel: "Descartar",
    });
  };

  const startBreak = () => {
    startTimeRef.current = Date.now();
    baseSecondsRef.current = seconds;
    setMode("break");
  };

  const skipBreak = () => {
    setMode(null);
    setTotalFocus(0);
    setSeconds(0);
    localStorage.removeItem(localStorageKeys.timer);
  };

  return {
    startFocus,
    stopFocus,
    startBreak,
    skipBreak,
    mode,
  };
};

export default useTimer;

const sendNotification = async () => {
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
