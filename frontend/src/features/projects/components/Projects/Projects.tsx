import Button from "../../../../shared/components/buttons/Button";

import Input from "../../../../shared/components/Input";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import ProjectModal from "../ProjectModal";
import Project from "./Project";

import { GoPlus } from "react-icons/go";
import { useProjects } from "../../hooks/useProjects";
import { GoSearch } from "react-icons/go";

import clsx from "clsx";

const Projects = () => {
  const { Modal: CreateProject, openModal: openProjectModal } =
    useModalFactory(ProjectModal);

  const {
    projects,
    searchQuery,
    setSearchQuery,
    handleCreateProject,
    handleDeleteProject,
    handleEditProject,
  } = useProjects();

  return (
    <>
      <div
        className={clsx(
          "relative flex flex-col gap-3 py-4 w-full h-full min-h-0",
        )}
      >
        <div className="flex flex-col px-3 gap-4 items-center">
          <Button
            icon={<GoPlus size={25} />}
            className="fixed bottom-4 right-4 z-10 rounded-full!"
            onClick={openProjectModal}
          >
            Novo Projeto
          </Button>
          <div className="relative flex items-center w-full">
            <GoSearch size={20} className="absolute left-3 text-neutral-40" />
            <Input
              placeholder="Pesquisar projeto"
              className="w-full pl-10!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div
          className={clsx(
            "flex-1 flex flex-col px-3 pt-1 pb-13 gap-2 overflow-auto contain-content scrollbar-hidden",
          )}
        >
          {projects.map((item) => (
            <Project
              key={item.id}
              projectData={item}
              onDelete={() => handleDeleteProject(item.id)}
              onEdit={handleEditProject}
            />
          ))}
        </div>
      </div>
      <CreateProject confirm={handleCreateProject} />
    </>
  );
};

export default Projects;
