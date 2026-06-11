import { createContext, useContext, useEffect, useState } from "react";
import { useCreateSession } from "./useSessions";
import { localStorageKeys } from "../../shared/utils/local-storage.utils";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateSessionRequest } from "./sessions.types";

export interface ISaveSessionData {
  name: string;
  focusSeconds: number;
}

interface ISessionContext {
  restRatio: number;
  setRestRatio: (ratio: number) => void;
  handleSaveSession: (data: ISaveSessionData) => void;

  isSaving: boolean;
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

  useEffect(() => {
    localStorage.setItem(localStorageKeys.restRatio, restRatio.toString());
  }, [restRatio]);

  const handleSaveSession = ({ name, focusSeconds }: ISaveSessionData) => {
    const data: CreateSessionRequest = {
      name,
      focus: focusSeconds,
      ratio: restRatio / 100,
    };

    createSession(data, {
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
        isSaving,
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
