import { createContext, useContext } from "react";

import type { ProjectDTO } from "../../projects/dtos/projects-response";
import type { TagDTO } from "../../tags/dtos/tags-response";

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

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSessionContext must be used within a SessionProvider");

  return context;
};
