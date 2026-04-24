import { createContext, useContext, useState } from "react";
import useSessions from "./useSession";
import { useModal } from "../../shared/modal.context";

interface ISessionContext {
  focus: number;
  interruptions: number;
  setFocus: (focus: number) => void;
  setInterruptions: (interruptions: number) => void;
  handleSaveSession: () => Promise<void>;
  taskId: number;
  setTaskId: (taskId: number) => void;
  showSaveSessionModal: boolean;
  setShowSaveSessionModal: (show: boolean) => void;
  success: boolean;
  restRatio: number;
  setRestRatio: (ratio: number) => void;
}

export const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { createSession } = useSessions();
  const [focus, setFocus] = useState<number>(0);
  const [interruptions, setInterruptions] = useState<number>(0);
  const [taskId, setTaskId] = useState<number>(0);
  const [showSaveSessionModal, setShowSaveSessionModal] =
    useState<boolean>(false);

  const [success, setSuccess] = useState<boolean>(false);
  const { showError, hideModal } = useModal();

  const [restRatio, setRestRatio] = useState<number>(20);

  const handleSaveSession = async () => {
    setSuccess(false);
    try {
      await createSession(taskId, {
        focus,
        interruptions,
        ratio: restRatio / 100,
      });
      setSuccess(true);
    } catch (error) {
      console.log(error);
      if (error instanceof Error)
        showError({
          title: "Error",
          message: error.message,
          action: hideModal,
        });
    }
  };

  return (
    <SessionContext.Provider
      value={{
        focus,
        interruptions,
        setFocus,
        setInterruptions,
        handleSaveSession,
        taskId,
        setTaskId,
        showSaveSessionModal,
        setShowSaveSessionModal,
        success,
        restRatio,
        setRestRatio,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSessionContext must be used within a SessionProvider");

  return context;
};
