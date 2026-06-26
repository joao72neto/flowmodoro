import { useMemo, useState } from "react";
import { GoPlus, GoSearch } from "react-icons/go";
import { RxUpdate } from "react-icons/rx";

import Input from "../../../../shared/components/inputs/Input";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import ProjectModal from "../ProjectModal";
import Project from "./Project";
import EmptyProjects from "./EmptyProjects";
import ExpandableButton from "../../../../shared/components/buttons/ExpandableButton";
import clsx from "clsx";
import type { ProjectResponse } from "../../projects.types";
import Tags from "../../../tags/components/Tags/Tags";
import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "../../hooks/useProjects";
import { useSessionContext } from "../../../sessions/sessions.context";

const Projects = () => {
  const { projects } = useSessionContext();

  const [selectedProject, setSelectedProject] =
    useState<ProjectResponse | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { Modal: CreateProject, openModal: openProjectModal } =
    useModalFactory(ProjectModal);

  const { Modal: EditProject, openModal: openEditModal } =
    useModalFactory(ProjectModal);

  const { mutate: handleCreateProject } = useCreateProject();
  const { mutate: handleDeleteProject } = useDeleteProject();
  const { mutate: handleEditProject } = useUpdateProject();

  const filteredProjects = useMemo(() => {
    return projects?.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [projects, searchQuery]);

  if (!projects || !filteredProjects)
    return <div>Não foi possivel carregar os projetos</div>;

  const isEmpty = filteredProjects.length === 0;

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <div
          className={clsx(
            "flex w-[200%] h-full transition-transform duration-300 ease-in-out transform-gpu will-change-transform",
            selectedProject ? "-translate-x-1/2" : "translate-x-0",
          )}
        >
          <div className="w-1/2 h-full flex flex-col gap-4 px-3 py-4 min-h-0 shrink-0 relative">
            <h2 className="text-xl text-neutral-20">Projetos</h2>

            <div className="flex flex-col gap-4 items-center">
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
                filteredProjects.map((item) => (
                  <Project
                    key={item.id}
                    projectData={item}
                    onDelete={() => handleDeleteProject(item.id)}
                    onEdit={() => {
                      setEditingProject(item);
                      openEditModal();
                    }}
                    onSelectTags={setSelectedProject}
                  />
                ))
              )}
            </div>
            <ExpandableButton
              icon={<GoPlus size={25} />}
              className="absolute bottom-4 right-4 z-10 rounded-full!"
              onClick={openProjectModal}
            >
              Novo Projeto
            </ExpandableButton>
          </div>

          <div className="w-1/2 h-full shrink-0 relative">
            <Tags
              project={selectedProject || { id: 0, name: "" }}
              onBack={() => setSelectedProject(null)}
            />
          </div>
        </div>
      </div>
      <CreateProject save={handleCreateProject} />
      <EditProject
        title="Atualizar Projeto"
        edit={handleEditProject}
        defaultValues={editingProject || undefined}
        inputLabel="Novo nome"
        confirmButtonIcon={<RxUpdate />}
        confirmButtonText="Atualizar"
      />
    </>
  );
};
export default Projects;
