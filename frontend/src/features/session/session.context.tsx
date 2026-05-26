import { createContext, useContext, useEffect, useState } from "react";
import useSessions from "./useSession";
import { useModal } from "../../shared/modal.context";
import { localStorageKeys } from "../../shared/utils/local-storage.utils";
import type {
  ISessionGroupResponse,
  UpdateSessionRequest,
} from "./session.types";
import type { PaginationResponse } from "../../shared/globals.types";

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
  sessions: PaginationResponse<ISessionGroupResponse> | undefined;
  fetchSessions: (
    page?: number,
    size?: number,
  ) => Promise<PaginationResponse<ISessionGroupResponse>>;
  loading: boolean;
  updateSession: (id: number, data: UpdateSessionRequest) => Promise<any>;
  deleteSession: (id: number) => Promise<any>;
}

export const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    createSession,
    fetchSessions,
    sessions,
    updateSession: updateSessionHook,
    deleteSession: deleteSessionHook,
    loading: isLoadingSessions,
  } = useSessions();
  const [success, setSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
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
    setIsSaving(true);
    try {
      await createSession(taskId, {
        focus: focusSeconds,
        interruptions,
        ratio: restRatio / 100,
      });

      setSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        showError({
          title: "Erro ao salvar sessão",
          message: error.message,
          action: hideModal,
        });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccess(false), 1000);
    }
  };

  const updateSession = async (id: number, data: UpdateSessionRequest) => {
    try {
      const res = await updateSessionHook(id, data);
      await fetchSessions();
      return res;
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        showError({
          title: "Erro ao atualizar sessão",
          message: error.message,
          action: hideModal,
        });
      throw error;
    }
  };

  const deleteSession = async (id: number) => {
    try {
      const res = await deleteSessionHook(id);
      await fetchSessions();
      return res;
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        showError({
          title: "Erro ao deletar sessão",
          message: error.message,
          action: hideModal,
        });
      throw error;
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
        sessions,
        fetchSessions,
        loading: isLoadingSessions || isSaving,
        updateSession,
        deleteSession,
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
