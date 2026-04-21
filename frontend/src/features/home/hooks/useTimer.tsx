import { useState, useEffect, useRef } from "react";
import { useSessionContext } from "../../session/contexts/SessionContext";
import { useTaskContext } from "../../task/contexts/TaskContext";
import { useModal } from "../../../shared/contexts/ModalContext";

import { localStorageKeys } from "../../../shared/utils/local-storage.utils";

const useTimer = () => {
  const { setFocus, setShowSaveSessionModal } = useSessionContext();
  const { activeTask, setIsSidebarOpen } = useTaskContext();
  const { showDefault, hideModal } = useModal();

  const BREAK_RATIO = 0.2;

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
      showDefault(
        "Nenhuma tarefa selecionada",
        "Crie ou selecione uma tarefa para dar início ao timer.",
        hideModal,
      );
      setIsSidebarOpen(true);
      return;
    }

    const now = Date.now();
    startTimeRef.current = now;
    baseSecondsRef.current = 0;
    setSeconds(0);
    setMode("focus");
  };

  const stopFocus = () => {
    setMode("stopped");
    const breakTime = Math.floor(seconds * BREAK_RATIO);
    setSeconds(breakTime);
    baseSecondsRef.current = breakTime;
    startTimeRef.current = Date.now();
    setFocus(Number((seconds / 60).toFixed(2)));
    setShowSaveSessionModal(true);
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

  const formatTimer = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (totalSeconds % 60).toString().padStart(2, "0");
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
  };
};

export default useTimer;
