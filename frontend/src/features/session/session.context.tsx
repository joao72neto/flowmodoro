import { createContext, useContext, useEffect, useState } from "react";
import {
  useCreateSession,
  useDeleteSession,
  useUpdateSession,
} from "./useSessions";
import { localStorageKeys } from "../../shared/utils/local-storage.utils";
import type { UpdateSessionRequest } from "./session.types";
import { useQueryClient } from "@tanstack/react-query";

export interface ISaveSessionData {
  taskId: number;
  focusSeconds: number;
  interruptions: number;
}

interface ISessionContext {
  restRatio: number;
  setRestRatio: (ratio: number) => void;
  handleSaveSession: (data: ISaveSessionData) => void;
  handleUpdateSession: ({
    id,
    data,
  }: {
    id: number;
    data: UpdateSessionRequest;
  }) => void;
  handleDeleteSession: (id: number) => void;

  isSaving: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
}

export const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [restRatio, setRestRatio] = useState<number>(() => {
    const saved = localStorage.getItem(localStorageKeys.restRatio);
    return saved ? Number(saved) : 20;
  });

  const queryClient = useQueryClient();
  const { mutate: createSession, isPending: isSaving } = useCreateSession();
  const { mutate: deleteSession, isPending: isDeleting } = useDeleteSession();
  const { mutate: updateSession, isPending: isUpdating } = useUpdateSession();

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

  const handleUpdateSession = ({
    id,
    data,
  }: {
    id: number;
    data: UpdateSessionRequest;
  }) => {
    updateSession(
      { id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["sessions"],
          });
        },
      },
    );
  };

  const handleDeleteSession = (id: number) => {
    deleteSession(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["sessions"],
        });
      },
    });
  };

  return (
    <SessionContext.Provider
      value={{
        handleSaveSession,
        restRatio,
        setRestRatio,
        handleUpdateSession,
        handleDeleteSession,
        isSaving,
        isUpdating,
        isDeleting,
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
