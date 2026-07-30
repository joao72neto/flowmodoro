import { useState, useEffect, useRef, useCallback } from "react";

import {
  updateFaviconWithTime,
  resetFavicon,
} from "../../../shared/utils/favicon.utils";

import { formatToHour } from "../../../shared/utils/number.utils";
import { localStorageKeys } from "../../../shared/utils/storage.utils";
import { useModal } from "../../../shared/contexts/modal/modal.context";
import { useSessionContext } from "../../sessions/context/sessions.context";

import { setTick, getTick, subscribeTick } from "../utils/timer-tick.store";
import useAlarm from "../../../mobile/useAlarm";
import { LocalNotifications } from "@capacitor/local-notifications";

const useTimer = () => {
  const { restRatio, handleSaveSession } = useSessionContext();
  const { showDefault, hideModal } = useModal();

  const { playAlarm, stopAlarm } = useAlarm();

  const BREAK_RATIO = restRatio / 100;

  const [mode, setMode] = useState<"focus" | "break" | "stopped" | null>(() => {
    const saved = localStorage.getItem(localStorageKeys.timer);
    return saved ? JSON.parse(saved).mode : null;
  });

  const initialSeconds = (() => {
    const saved = localStorage.getItem(localStorageKeys.timer);
    if (!saved) return 0;
    const { mode, seconds, lastUpdated } = JSON.parse(saved);
    const diff = Math.floor((Date.now() - lastUpdated) / 1000);
    if (mode === "focus") return seconds + diff;
    if (mode === "break") return Math.max(0, seconds - diff);
    return seconds;
  })();

  useEffect(() => {
    setTick(initialSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimeRef = useRef<number>(Date.now());
  const baseSecondsRef = useRef<number>(initialSeconds);

  useEffect(() => {
    const persist = () => {
      const currentSeconds = getTick();
      localStorage.setItem(
        localStorageKeys.timer,
        JSON.stringify({
          mode,
          seconds: currentSeconds,
          lastUpdated: Date.now(),
        }),
      );
    };

    persist();

    if (mode !== "focus" && mode !== "break") return;

    const interval = setInterval(persist, 5000);
    window.addEventListener("beforeunload", persist);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", persist);
      persist();
    };
  }, [mode]);

  useEffect(() => {
    const updateFavicon = () => {
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

    updateFavicon();

    if (mode !== "focus" && mode !== "break") return;

    let lastText: string | null = null;
    const unsub = subscribeTick(() => {
      const s = getTick();
      const text = s < 60 ? s.toString() : Math.floor(s / 60).toString();
      if (text !== lastText) {
        lastText = text;
        updateFavicon();
      }
    });

    return unsub;
  }, [mode]);

  LocalNotifications.addListener(
    "localNotificationActionPerformed",
    (notificationAction) => {
      if (notificationAction.notification.id === 1) {
        stopAlarm();
      }
    },
  );

  useEffect(() => {
    if (mode === "break") {
      const targetTime = new Date(Date.now() + baseSecondsRef.current * 1000);
      playAlarm(targetTime);
    }

    const syncTime = () => {
      if (mode === "focus" || mode === "break") {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - startTimeRef.current) / 1000);

        if (mode === "focus") {
          setTick(baseSecondsRef.current + diffInSeconds);
        } else if (mode === "break") {
          const remaining = baseSecondsRef.current - diffInSeconds;
          if (remaining <= 0) {
            setTick(0);
            setMode(null);
          } else {
            setTick(remaining);
          }
        }
      }
    };

    let interval: ReturnType<typeof setInterval> | null = null;
    const startInterval = () => {
      if (interval) return;
      interval = setInterval(syncTime, 1000);
    };
    const stopInterval = () => {
      if (interval) clearInterval(interval);
      interval = null;
    };

    const handleVisibility = () => {
      syncTime();
      if (document.hidden) stopInterval();
      else startInterval();
    };

    if (!document.hidden) startInterval();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const startFocus = useCallback(() => {
    const now = Date.now();
    startTimeRef.current = now;
    baseSecondsRef.current = 0;
    setTick(0);
    setMode("focus");
  }, []);

  const stopFocus = useCallback(() => {
    const finalFocusSeconds = getTick();
    setMode("stopped");
    const breakTime = Math.floor(finalFocusSeconds * BREAK_RATIO);

    setTick(breakTime);
    baseSecondsRef.current = breakTime;
    startTimeRef.current = Date.now();

    showDefault({
      title: "Sessão Finalizada! 🎉",
      message: `Deseja salvar a sessão atual de ${formatToHour(finalFocusSeconds)}?`,
      action: () => {
        handleSaveSession({ focusSeconds: finalFocusSeconds });
      },
      cancel: () => {
        setMode(null);
        hideModal();
      },
      confirmLabel: "Salvar",
      cancelLabel: "Descartar",
    });
  }, [BREAK_RATIO, handleSaveSession, hideModal, showDefault]);

  const startBreak = useCallback(() => {
    startTimeRef.current = Date.now();
    baseSecondsRef.current = getTick();
    setMode("break");
  }, []);

  const skipBreak = useCallback(() => {
    setMode(null);
    setTick(0);
    localStorage.removeItem(localStorageKeys.timer);
  }, []);

  return {
    startFocus,
    stopFocus,
    startBreak,
    skipBreak,
    mode,
  };
};

export default useTimer;
