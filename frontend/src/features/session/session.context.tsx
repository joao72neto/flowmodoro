import { createContext, useContext, useEffect, useState } from "react";
import useSessions from "./useSession";
import { useModal } from "../../shared/modal.context";
import { localStorageKeys } from "../../shared/utils/local-storage.utils";

interface ISaveSessionData {
  taskId: number;
  focusSeconds: number;
  interruptions: number;
}

interface ISessionContext {
  handleSaveSession: (data: ISaveSessionData) => Promise<void>;
  success: boolean;
  setSuccess: (success: boolean) => void;
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
  const [success, setSuccess] = useState<boolean>(false);
  const { showError, hideModal } = useModal();

  const [restRatio, setRestRatio] = useState<number>(() => {
    const saved = localStorage.getItem(localStorageKeys.restRatio);
    return saved ? Number(saved) : 20;
  });

  useEffect(() => {
    localStorage.setItem(localStorageKeys.restRatio, restRatio.toString());
  }, [restRatio]);

  const handleSaveSession = async ({
    taskId,
    focusSeconds,
    interruptions,
  }: ISaveSessionData) => {
    setSuccess(false);
    try {
      await createSession(taskId, {
        focus: focusSeconds,
        interruptions,
        ratio: restRatio / 100,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1000);
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        showError({
          title: "Erro ao salvar sessão",
          message: error.message,
          action: hideModal,
        });
    }
  };

  return (
    <SessionContext.Provider
      value={{
        handleSaveSession,
        success,
        setSuccess,
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
