import { useCallback, useMemo, useState } from "react";

import { localStorageKeys } from "../../../shared/utils/storage.utils";
import { useCreateSession } from "../hooks/useSessions";
import { useFetchTagsByProject } from "../../tags/hooks/useTags";
import { useFetchProjects } from "../../projects/hooks/useProjects";
import { SessionContext } from "./sessions.context";
import type { ISaveSessionData } from "./sessions.context";
import { getStorageObject } from "../../../shared/utils/storage.utils";
import type { SessionPayloadDTO } from "../dtos/sessions-request";

import { v4 as uuidv4 } from "uuid";
import { getRatio } from "../../timer/timer.store";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const initialSessionDraft = getStorageObject(localStorageKeys.session, {
    sessionName: "",
    selectedProjectId: null as string | null,
    selectedTagId: null as string | null,
  });

  const [sessionName, setSessionName] = useState<string>(
    initialSessionDraft.sessionName,
  );

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    initialSessionDraft.selectedProjectId,
  );

  const { data: projects = [] } = useFetchProjects();

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const [selectedTagId, setSelectedTagId] = useState<string | null>(
    initialSessionDraft.selectedTagId,
  );

  const { data: tags = [] } = useFetchTagsByProject(selectedProjectId || "");

  const selectedTag = useMemo(
    () => tags.find((t) => t.id === selectedTagId) ?? null,
    [tags, selectedTagId],
  );

  const { mutate: createSession } = useCreateSession();

  const handleSaveSession = useCallback(
    ({ focusSeconds }: ISaveSessionData) => {
      setCurrentPage(1);
      const session: SessionPayloadDTO = {
        id: uuidv4(),
        name: sessionName,
        focus: focusSeconds,
        ratio: getRatio() / 100,
        projectId: selectedProjectId || undefined,
        tagId: selectedTagId || undefined,
      };

      createSession(session);
    },
    [sessionName, selectedProjectId, selectedTagId, createSession],
  );

  const value = useMemo(
    () => ({
      currentPage,
      setCurrentPage,

      handleSaveSession,

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
    }),
    [
      currentPage,
      handleSaveSession,
      projects,
      tags,
      selectedProjectId,
      selectedTagId,
      selectedTag,
      selectedProject,
      sessionName,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
