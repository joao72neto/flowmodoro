import { GoPlus, GoSearch } from "react-icons/go";

import Input from "../../../../shared/components/Input";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import ProjectModal from "../ProjectModal";
import Project from "./Project";
import EmptyProjects from "./EmptyProjects";
import { useProjects } from "../../hooks/useProjects";
import ExpandableButton from "../../../../shared/components/buttons/ExpandableButton";
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

  const isEmpty = projects.length === 0;

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
        <div
          className={clsx(
            "flex-1 flex flex-col gap-2 overflow-auto contain-content scrollbar-hidden",
            isEmpty && "justify-center",
          )}
        >
          {isEmpty ? (
            <EmptyProjects
              title={searchQuery ? "Nenhum resultado" : "Sem projetos"}
              message={
                searchQuery
                  ? `Não encontramos nada para "${searchQuery}".`
                  : "Crie seu primeiro projeto para começar a organizar seu tempo."
              }
            />
          ) : (
            projects.map((item) => (
              <Project
                key={item.id}
                projectData={item}
                onDelete={() => handleDeleteProject(item.id)}
                onEdit={handleEditProject}
              />
            ))
          )}
        </div>
      </div>
      <CreateProject confirm={handleCreateProject} />
    </>
  );
};
export default Projects;
