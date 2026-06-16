import DropDownMenu from "../../../../shared/components/DropDownMenu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import ProjectModal from "../ProjectModal";
import type { ProjectType } from "../../projects.types";
import { MdModeEditOutline } from "react-icons/md";

import { RxUpdate } from "react-icons/rx";
import { RxTrash } from "react-icons/rx";

import clsx from "clsx";
import { useModal } from "../../../../shared/modal.context";

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

  const { showWarning, hideModal } = useModal();

  const handleDelete = () => {
    showWarning({
      title: "Deseja mesmo excluir este projeto?",
      message: "Esta operação não pode ser desfeita.",
      cancel: hideModal,
      action: () => {
        onDelete?.();
        hideModal();
      },
    });
  };

  return (
    <>
      <div
        className={clsx(
          "p-4 rounded-xl bg-neutral-80/50 flex justify-between items-center border border-border",
          "hover:border-neutral-70 hover:bg-neutral-80 transition-all duration-100 group shadow-md",
        )}
      >
        <span className="font-medium text-neutral-10 truncate mr-4 flex-1">
          {projectData.name}
        </span>
        <DropDownMenu
          items={[
            {
              label: "Editar",
              onClick: openProjectModal,
              icon: <MdModeEditOutline />,
            },
            { label: "Excluir", onClick: handleDelete, icon: <RxTrash /> },
          ]}
        >
          <div
            className={clsx(
              "p-1 rounded-md hover:bg-neutral-70 transition-colors text-neutral-40",
              "group-hover:text-neutral-10",
            )}
          >
            <BsThreeDotsVertical size={20} />
          </div>
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
