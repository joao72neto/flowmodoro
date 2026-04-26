import { useState, useEffect, useRef } from "react";
import { useSessionContext } from "../session/session.context";
import { useTaskContext } from "../task/task.context";
import { useModal } from "../../shared/modal.context";

import { localStorageKeys } from "../../shared/utils/local-storage.utils";
import {
  updateFaviconWithTime,
  resetFavicon,
} from "../../shared/utils/favicon.utils";

import { formatToHour } from "../../shared/utils/number.utils";

const useTimer = () => {
  const { handleSaveSession, restRatio } = useSessionContext();
  const { activeTask, setIsSidebarOpen } = useTaskContext();
  const { showDefault, showWarning, hideModal } = useModal();

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

  const [interruptions, setInterruptions] = useState(0);

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
      updateFaviconWithTime({ time: faviconTime, color: "#ef4444" });
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
            if (Notification.permission === "granted") {
              new Notification("Pausa Finalizada!", {
                body: "Sua pausa acabou. Hora de voltar ao foco!",
                icon: "/flowmodoro-icon.svg",
              });
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
    if (!activeTask) {
      showDefault({
        title: "Nenhuma tarefa selecionada",
        message: "Crie ou selecione uma tarefa para dar início ao timer.",
        action: hideModal,
      });
      setIsSidebarOpen(true);
      return;
    }

    const now = Date.now();
    startTimeRef.current = now;
    baseSecondsRef.current = 0;
    setSeconds(0);
    setInterruptions(0);
    setMode("focus");
    setIsSidebarOpen(false);
  };

  const stopFocus = () => {
    const finalFocusSeconds = seconds;
    setMode("stopped");
    const breakTime = Math.floor(finalFocusSeconds * BREAK_RATIO);
    setSeconds(breakTime);
    baseSecondsRef.current = breakTime;
    startTimeRef.current = Date.now();
    setIsSidebarOpen(false);

    showWarning({
      title: "Sessão Finalizada! 🎉",
      message: `Deseja salvar a sessão atual de ${formatToHour(finalFocusSeconds)}?`,
      action: () => {
        if (activeTask) {
          handleSaveSession({
            taskId: activeTask.id,
            focusSeconds: finalFocusSeconds,
            interruptions,
          });
        }
        hideModal();
      },
      cancel: () => {
        setMode(null);
        hideModal();
      },
    });
  };

  const startBreak = () => {
    startTimeRef.current = Date.now();
    baseSecondsRef.current = seconds;
    setMode("break");
    setIsSidebarOpen(false);
  };

  const skipBreak = () => {
    setMode(null);
    setIsSidebarOpen(false);

    setSeconds(0);
    localStorage.removeItem(localStorageKeys.timer);
  };

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);

    const min = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");

    const sec = (totalSeconds % 60).toString().padStart(2, "0");

    if (hours > 0) return `${hours.toString().padStart(2, "0")}:${min}:${sec}`;

    return `${min}:${sec}`;
  };

  return {
    startFocus,
    stopFocus,
    startBreak,
    skipBreak,
    formatTimer,
    mode,
    seconds,
    interruptions,
    setInterruptions,
  };
};

export default useTimer;
