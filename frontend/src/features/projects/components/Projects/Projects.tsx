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
import Tags from "../../../tags/components/Tags/Tags";

import ProjectsSkeleton from "./ProjectsSkeleton";
import {
  useCreateProject,
  useDeleteProject,
  useFetchProjects,
  useUpdateProject,
} from "../../hooks/useProjects";
import type { ProjectDTO } from "../../dtos/projects-response";

const Projects = () => {
  const { data: projects, isLoading } = useFetchProjects();

  const [selectedProject, setSelectedProject] = useState<ProjectDTO | null>(
    null,
  );
  const [editingProject, setEditingProject] = useState<ProjectDTO | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { Modal: CreateProject, openModal: openProjectModal } =
    useModalFactory(ProjectModal);

  const { Modal: EditProject, openModal: openEditModal } =
    useModalFactory(ProjectModal);

  const { mutate: handleCreateProject, isPending: isSaving } =
    useCreateProject();

  const { mutate: handleEditProject, isPending: isUpdating } =
    useUpdateProject();

  const { mutate: handleDeleteProject } = useDeleteProject();

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [projects, searchQuery]);

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

            {isLoading ? (
              <ProjectsSkeleton />
            ) : (
              <div
                className={clsx(
                  "flex-1 flex flex-col gap-2 p-1 overflow-auto contain-content scrollbar-hidden",
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
                      onDelete={() => {
                        handleDeleteProject(item.id);
                      }}
                      onEdit={() => {
                        setEditingProject(item);
                        openEditModal();
                      }}
                      onSelectTags={setSelectedProject}
                    />
                  ))
                )}
              </div>
            )}

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
              project={selectedProject || { id: "", name: "", totalFocus: 0 }}
              onBack={() => setSelectedProject(null)}
            />
          </div>
        </div>
      </div>
      <CreateProject save={handleCreateProject} loading={isSaving} />
      <EditProject
        title="Atualizar Projeto"
        edit={handleEditProject}
        loading={isUpdating}
        defaultValues={editingProject || undefined}
        inputLabel="Novo nome"
        confirmButtonIcon={<RxUpdate />}
        confirmButtonText="Atualizar"
      />
    </>
  );
};
export default Projects;
