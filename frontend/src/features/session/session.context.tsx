import { createContext, useContext, useEffect, useState } from "react";
import { useCreateSession, useSessions } from "./useSessions";
import { useModal } from "../../shared/modal.context";
import { localStorageKeys } from "../../shared/utils/local-storage.utils";
import type { UpdateSessionRequest } from "./session.types";
import { useQueryClient } from "@tanstack/react-query";

export interface ISaveSessionData {
  taskId: number;
  focusSeconds: number;
  interruptions: number;
}

interface ISessionContext {
  handleSaveSession: (data: ISaveSessionData) => void;
  restRatio: number;
  setRestRatio: (ratio: number) => void;
  updateSession: (id: number, data: UpdateSessionRequest) => Promise<any>;
  deleteSession: (id: number) => Promise<any>;

  isSavingSession: boolean;
}

export const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { updateSession: updateSessionHook, deleteSession: deleteSessionHook } =
    useSessions();

  const { showError, hideModal } = useModal();

  const [restRatio, setRestRatio] = useState<number>(() => {
    const saved = localStorage.getItem(localStorageKeys.restRatio);
    return saved ? Number(saved) : 20;
  });

  const queryClient = useQueryClient();
  const { mutate: createSession, isPending: isSavingSession } =
    useCreateSession();

  useEffect(() => {
    localStorage.setItem(localStorageKeys.restRatio, restRatio.toString());
  }, [restRatio]);

  const handleSaveSession = ({
    taskId,
    focusSeconds,
    interruptions,
  }: ISaveSessionData) => {
    createSession(
      {
        id: taskId,
        data: {
          focus: focusSeconds,
          interruptions,
          ratio: restRatio / 100,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["sessions"],
          });
        },
      },
    );
  };

  const updateSession = async (id: number, data: UpdateSessionRequest) => {
    try {
      const res = await updateSessionHook(id, data);
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
        restRatio,
        setRestRatio,
        updateSession,
        deleteSession,

        isSavingSession,
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
