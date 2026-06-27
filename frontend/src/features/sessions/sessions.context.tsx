import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCreateSession } from "./hooks/useSessionsApi";

import type { TagResponse } from "../tags/tags.types";
import type { ProjectResponse } from "../projects/projects.types";
import { useFetchProjects } from "../projects/hooks/useProjects";
import { useFetchTagsByProject } from "../tags/hooks/useTags";
import { localStorageKeys } from "../../shared/utils/storage.utils";

export interface ISaveSessionData {
  focusSeconds: number;
}

interface ISessionContext {
  restRatio: number;
  setRestRatio: (ratio: number) => void;
  handleSaveSession: (data: ISaveSessionData) => void;

  projects: ProjectResponse[] | undefined;
  tags: TagResponse[] | undefined;

  selectedProjectId: number | null;
  selectedTagId: number | null;
  setSelectedProjectId: (id: number | null) => void;
  setSelectedTagId: (id: number | null) => void;

  selectedTag: TagResponse | null;
  selectedProject: ProjectResponse | null;

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

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    () => {
      const saved = localStorage.getItem(localStorageKeys.session);
      const { selectedProjectId } = saved
        ? JSON.parse(saved)
        : { selectedProjectId: null };
      return selectedProjectId;
    },
  );
  const { data: projects = [] } = useFetchProjects();

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const [selectedTagId, setSelectedTagId] = useState<number | null>(() => {
    const saved = localStorage.getItem(localStorageKeys.session);
    const { selectedTagId } = saved
      ? JSON.parse(saved)
      : { selectedTagId: null };
    return selectedTagId;
  });
  const { data: tags = [] } = useFetchTagsByProject(selectedProjectId || 0);

  const selectedTag = useMemo(
    () => tags.find((t) => t.id === selectedTagId) ?? null,
    [tags, selectedTagId],
  );

  const { mutate: createSession, isPending: isSaving } = useCreateSession();
  const [sessionName, setSessionName] = useState(() => {
    const saved = localStorage.getItem(localStorageKeys.session);
    const { sessionName } = saved ? JSON.parse(saved) : { sessionName: "" };
    return sessionName;
  });

  useEffect(() => {
    localStorage.setItem(
      localStorageKeys.session,
      JSON.stringify({ sessionName, selectedProjectId, selectedTagId }),
    );
  }, [selectedProjectId, selectedTagId, sessionName]);

  useEffect(() => {
    localStorage.setItem(localStorageKeys.restRatio, restRatio.toString());
  }, [restRatio]);

  const handleSaveSession = ({ focusSeconds }: ISaveSessionData) => {
    createSession({
      name: sessionName,
      focus: focusSeconds,
      ratio: restRatio / 100,
      projectId: selectedProject?.id,
      tagId: selectedTag?.id,
    });
  };

  return (
    <SessionContext.Provider
      value={{
        handleSaveSession,
        restRatio,
        setRestRatio,
        isSaving,

        projects,
        tags,

        selectedProjectId,
        selectedTagId,
        setSelectedProjectId,
        setSelectedTagId,

        selectedTag,
        selectedProject,

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
