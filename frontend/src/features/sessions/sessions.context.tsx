import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { localStorageKeys } from "../../shared/utils/storage.utils";
import { useCreateLocalSession } from "./offline/hooks/useLocalSessions";
import { useFetchLocalTagsByProject } from "../tags/offline/hooks/useLocalTags";
import { useFetchLocalProjects } from "../projects/offline/hooks/useLocalProjects";
import type { ProjectDTO } from "../projects/offline/project.dtos";
import type { TagDTO } from "../tags/offline/tag.dtos";

export interface ISaveSessionData {
  focusSeconds: number;
}

interface ISessionContext {
  currentPage: number;
  setCurrentPage: (page: number) => void;

  restRatio: number;
  setRestRatio: (ratio: number) => void;
  handleSaveSession: (data: ISaveSessionData) => void;

  projects: ProjectDTO[] | undefined;
  tags: TagDTO[] | undefined;

  selectedProjectId: string | null;
  selectedTagId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedTagId: (id: string | null) => void;

  selectedTag: TagDTO | null;
  selectedProject: ProjectDTO | null;

  setSessionName: (name: string) => void;
  sessionName: string;
}

export const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [sessionName, setSessionName] = useState<string>(() => {
    const saved = localStorage.getItem(localStorageKeys.session);
    const { sessionName } = saved ? JSON.parse(saved) : { sessionName: "" };
    return sessionName;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    () => {
      const saved = localStorage.getItem(localStorageKeys.session);
      const { selectedProjectId } = saved
        ? JSON.parse(saved)
        : { selectedProjectId: null };
      return selectedProjectId;
    },
  );
  const { data: projects = [] } = useFetchLocalProjects();

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const [selectedTagId, setSelectedTagId] = useState<string | null>(() => {
    const saved = localStorage.getItem(localStorageKeys.session);
    const { selectedTagId } = saved
      ? JSON.parse(saved)
      : { selectedTagId: null };
    return selectedTagId;
  });

  const { data: tags = [] } = useFetchLocalTagsByProject(
    selectedProjectId || "",
  );

  const selectedTag = useMemo(
    () => tags.find((t) => t.id === selectedTagId) ?? null,
    [tags, selectedTagId],
  );

  const [restRatio, setRestRatio] = useState<number>(() => {
    const saved = localStorage.getItem(localStorageKeys.restRatio);
    return saved ? Number(saved) : 20;
  });

  useEffect(() => {
    localStorage.setItem(localStorageKeys.restRatio, restRatio.toString());
  }, [restRatio]);

  const { mutate: createLocalSession } = useCreateLocalSession();

  const handleSaveSession = ({ focusSeconds }: ISaveSessionData) => {
    setCurrentPage(1);
    createLocalSession({
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
        currentPage,
        setCurrentPage,

        handleSaveSession,
        restRatio,
        setRestRatio,

        projects,
        tags,

        selectedProjectId,
        selectedTagId,
        setSelectedProjectId,
        setSelectedTagId,

        selectedTag,
        selectedProject,

        setSessionName,
        sessionName,
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
