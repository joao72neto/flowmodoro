import { useEffect, useMemo, useState } from "react";

import { localStorageKeys } from "../../../shared/utils/storage.utils";
import { useCreateLocalSession } from "../hooks/useLocalSessions";
import { useFetchLocalTagsByProject } from "../../tags/local/hooks/useLocalTags";
import { useFetchLocalProjects } from "../../projects/local/hooks/useLocalProjects";
import { SessionContext } from "./sessions.context";
import type { ISaveSessionData } from "./sessions.context";

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
