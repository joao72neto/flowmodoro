import { useState } from "react";
import { useSessionContext } from "../../session/contexts/SessionContext";
import { useTaskContext } from "../../task/contexts/TaskContext";
import { useModal } from "../../../shared/contexts/ModalContext";

const useTimer = () => {
  const { setFocus, setShowSaveSessionModal } = useSessionContext();

  const BREAK_RATIO = 0.2;
  const [seconds, setSeconds] = useState(0);
  const [mode, setMode] = useState<"focus" | "break" | "stopped" | null>(null);
  const { activeTask, setIsSidebarOpen } = useTaskContext();

  const { showDefault, hideModal } = useModal();

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

    setSeconds(0);
    setMode("focus");
  };

  const stopFocus = () => {
    setMode("stopped");
    const breakTime = Math.floor(seconds * BREAK_RATIO);
    setSeconds(breakTime);
    setFocus(Number((seconds / 60).toFixed(2)));
    setShowSaveSessionModal(true);
  };

  const startBreak = () => {
    setMode("break");
  };

  const skipBreak = () => {
    setMode(null);
    setSeconds(0);
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
    setMode,
    seconds,
    setSeconds,
  };
};

export default useTimer;
