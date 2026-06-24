import { createContext, useContext, useEffect, useState } from "react";
import { useCreateSession } from "./hooks/useSessionsApi";
import { localStorageKeys } from "../../shared/utils/local-storage.utils";
import { useQueryClient } from "@tanstack/react-query";
import type { SessionPayload } from "./sessions.types";
import type { TagResponse } from "../tags/tags.types";
import type { ProjectResponse } from "../projects/projects.types";

export interface ISaveSessionData {
  focusSeconds: number;
}

interface ISessionContext {
  restRatio: number;
  setRestRatio: (ratio: number) => void;
  handleSaveSession: (data: ISaveSessionData) => void;

  selectedTag: TagResponse | null;
  selectedProject: ProjectResponse | null;
  setSelectedTag: (tag: TagResponse | null) => void;
  setSelectedProject: (project: ProjectResponse | null) => void;

  sessionName: string;
  setSessionName: (name: string) => void;

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

  const [selectedTag, setSelectedTag] = useState<TagResponse | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<ProjectResponse | null>(null);
  const [sessionName, setSessionName] = useState("");

  const queryClient = useQueryClient();
  const { mutate: createSession, isPending: isSaving } = useCreateSession();

  useEffect(() => {
    localStorage.setItem(localStorageKeys.restRatio, restRatio.toString());
  }, [restRatio]);

  const handleSaveSession = ({ focusSeconds }: ISaveSessionData) => {
    const data: SessionPayload = {
      name: sessionName,
      focus: focusSeconds,
      ratio: restRatio / 100,
      projectId: selectedProject?.id,
      tagId: selectedTag?.id,
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

        selectedTag,
        selectedProject,
        setSelectedTag,
        setSelectedProject,

        sessionName,
        setSessionName,
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
