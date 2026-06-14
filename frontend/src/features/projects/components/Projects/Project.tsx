import DropDownMenu from "../../../../shared/components/DropDownMenu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import ProjectModal from "../ProjectModal";
import type { ProjectType } from "../../projects.types";

import { RxUpdate } from "react-icons/rx";

const Project = ({
  projectData,
  onDelete,
  onEdit,
}: {
  projectData: ProjectType;
  onDelete?: () => void;
  onEdit?: (project: ProjectType) => void;
}) => {
  const { Modal: EditProject, openModal: openProjectModal } =
    useModalFactory(ProjectModal);

  return (
    <>
      <div className="p-4 rounded-lg bg-neutral-80 flex justify-between items-center border border-border">
        <span>{projectData.name}</span>
        <DropDownMenu
          items={[
            { label: "Editar", onClick: openProjectModal },
            { label: "Excluir", onClick: onDelete },
          ]}
        >
          <BsThreeDotsVertical size={20} />
        </DropDownMenu>
      </div>
      <EditProject
        title="Atualizar Projeto"
        confirm={onEdit}
        defaultValues={projectData}
        inputLabel="Novo nome"
        confirmButtonIcon={<RxUpdate />}
        confirmButtonText="Atualizar"
      />
    </>
  );
};

export default Project;
