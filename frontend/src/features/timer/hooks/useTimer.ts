import { useState, useEffect, useRef } from "react";

import {
  updateFaviconWithTime,
  resetFavicon,
} from "../../../shared/utils/favicon.utils";

import { formatToHour } from "../../../shared/utils/number.utils";
import healthService from "../../../shared/health.service";
import { useSessionContext } from "../../sessions/sessions.context";
import { localStorageKeys } from "../../../shared/utils/storage.utils";
import { useModal } from "../../../shared/contexts/modal.context";

const useTimer = () => {
  const { restRatio, handleSaveSession } = useSessionContext();
  const { showWarning, hideModal, setModalLoading } = useModal();

  const BREAK_RATIO = restRatio / 100;

  const [mode, setMode] = useState<"focus" | "break" | "stopped" | null>(() => {
    const saved = localStorage.getItem(localStorageKeys.timer);
    return saved ? JSON.parse(saved).mode : null;
  });

  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem(localStorageKeys.timer);
    if (!saved) return 0;
    const { mode, seconds, lastUpdated } = JSON.parse(saved);
    const diff = Math.floor((Date.now() - lastUpdated) / 1000);
    if (mode === "focus") return seconds + diff;
    if (mode === "break") return Math.max(0, seconds - diff);
    return seconds;
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
          setSeconds(baseSecondsRef.current + diffInSeconds);
        } else if (mode === "break") {
          const remaining = baseSecondsRef.current - diffInSeconds;
          if (remaining <= 0) {
            setSeconds(0);
            setMode(null);

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
                if ("serviceWorker" in navigator) {
                  const registration = await navigator.serviceWorker.ready;
                  registration.showNotification(
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

            sendNotification();
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

  useEffect(() => {
    if (mode === "focus" || mode === "break") {
      const KEEP_ALIVE_MS = 5 * 60 * 1000;

      const ping = () => {
        console.log("Keep-alive: mantendo o backend ativo...");
        healthService.getHealth().catch(() => {});
      };

      ping();

      const interval = setInterval(ping, KEEP_ALIVE_MS);

      return () => clearInterval(interval);
    }
  }, [mode]);

  const startFocus = () => {
    const now = Date.now();
    startTimeRef.current = now;
    baseSecondsRef.current = 0;
    setSeconds(0);
    setMode("focus");
  };

  const stopFocus = () => {
    const finalFocusSeconds = seconds;
    setMode("stopped");
    const breakTime = Math.floor(finalFocusSeconds * BREAK_RATIO);
    setSeconds(breakTime);
    baseSecondsRef.current = breakTime;
    startTimeRef.current = Date.now();

    showWarning({
      title: "Sessão Finalizada! 🎉",
      message: `Deseja salvar a sessão atual de ${formatToHour(finalFocusSeconds)}?`,
      action: () => {
        setModalLoading(true);
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

    setSeconds(0);
    localStorage.removeItem(localStorageKeys.timer);
  };

  return {
    startFocus,
    stopFocus,
    startBreak,
    skipBreak,
    mode,
    seconds,
  };
};

export default useTimer;
