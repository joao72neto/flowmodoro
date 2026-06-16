import { GoPlus, GoSearch } from "react-icons/go";

import Input from "../../../../shared/components/Input";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import ProjectModal from "../ProjectModal";
import Project from "./Project";
import { useProjects } from "../../hooks/useProjects";
import ExpandableButton from "../../../../shared/components/buttons/ExpandableButton";

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
          <ExpandableButton
            icon={<GoPlus size={25} />}
            className="fixed bottom-4 right-4 z-10 rounded-full!"
            onClick={openProjectModal}
          >
            Novo Projeto
          </ExpandableButton>
          <Input
            placeholder="Pesquisar projeto"
            icon={<GoSearch size={20} />}
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
