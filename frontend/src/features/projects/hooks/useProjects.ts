import { useState, useMemo } from "react";
import type { ProjectPayload, ProjectResponse } from "../projects.types";

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([
    { id: 1, name: "Violin" },
    { id: 2, name: "Flowmodoro" },
    { id: 3, name: "Piano" },
    { id: 4, name: "Coding" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateProject = (project: ProjectPayload) => {
    const nextId =
      projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    setProjects([{ id: nextId, name: project.name }, ...projects]);
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((item) => item.id !== id));
  };

  const handleEditProject = (project: ProjectResponse) => {
    setProjects(
      projects.map((item) =>
        item.id === project.id ? { ...item, name: project.name } : item,
      ),
    );
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [projects, searchQuery]);

  return {
    projects: filteredProjects,
    searchQuery,
    setSearchQuery,
    handleCreateProject,
    handleDeleteProject,
    handleEditProject,
  };
};
