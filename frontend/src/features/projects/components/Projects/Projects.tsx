import { useState } from "react";
import Button from "../../../../shared/components/buttons/Button";

import Input from "../../../../shared/components/Input";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import CreateProjectModal from "../ProjectModal";
import Project from "./Project";

import { GoPlus } from "react-icons/go";
import type { CreateProjectType, ProjectType } from "../../projects.types";

const Projects = () => {
  const { Modal: CreateProject, openModal: openProjectModal } =
    useModalFactory(CreateProjectModal);
  const [projects, setProjects] = useState<ProjectType[]>([
    { id: 1, name: "Violin" },
    { id: 2, name: "Flowmodoro" },
    { id: 3, name: "Piano" },
    { id: 4, name: "Coding" },
  ]);

  const handleCreateProject = (project: CreateProjectType) => {
    setProjects([{ id: projects.length + 1, name: project.name }, ...projects]);
  };

  const handleDeleteProject = (project: ProjectType) => {
    setProjects(projects.filter((item) => item.id !== project.id));
  };

  const handleEditProject = (project: ProjectType) => {
    setProjects(
      projects.map((item) =>
        item.id === project.id ? { ...item, name: project.name } : item,
      ),
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-3 w-full h-full min-h-0">
        <div className="flex flex-col gap-4 items-center">
          <Button
            icon={<GoPlus size={25} />}
            className="w-full"
            onClick={openProjectModal}
          >
            Novo Projeto
          </Button>
          <Input placeholder="Pesquisar projeto" className="border w-full" />
        </div>
        <div className="flex-1 flex flex-col gap-2 overflow-auto contain-content scrollbar-hidden">
          {projects.map((item) => (
            <Project
              key={item.id}
              name={item.name}
              onDelete={() => handleDeleteProject(item)}
            />
          ))}
        </div>
      </div>
      <CreateProject confirm={handleCreateProject} />
    </>
  );
};

export default Projects;
