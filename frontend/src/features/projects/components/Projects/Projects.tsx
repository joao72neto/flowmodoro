import Button from "../../../../shared/components/buttons/Button";

import Input from "../../../../shared/components/Input";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import ProjectModal from "../ProjectModal";
import Project from "./Project";

import { GoPlus } from "react-icons/go";
import { useProjects } from "../../hooks/useProjects";

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
      <div className="relative flex flex-col gap-4 px-3 py-4 w-full h-full min-h-0">
        <div className="flex flex-col gap-4 items-center">
          <Button
            icon={<GoPlus size={25} />}
            className="fixed bottom-4 right-4 z-10 rounded-full!"
            onClick={openProjectModal}
          >
            Novo Projeto
          </Button>
          <Input
            placeholder="Pesquisar projeto"
            className="border w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col gap-2 overflow-auto contain-content scrollbar-hidden">
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
