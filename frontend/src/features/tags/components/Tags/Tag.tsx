import DropDownMenu from "../../../../shared/components/DropDownMenu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import TagModal from "../TagModal";
import type { TagType } from "../../tags.types";
import { MdModeEditOutline } from "react-icons/md";
import { RxUpdate, RxTrash } from "react-icons/rx";
import clsx from "clsx";
import { useModal } from "../../../../shared/modal.context";

const Tag = ({
  tagData,
  onDelete,
  onEdit,
}: {
  tagData: TagType;
  onDelete?: () => void;
  onEdit?: (tag: TagType) => void;
}) => {
  const { Modal: EditTag, openModal: openTagModal } = useModalFactory(TagModal);

  const { showWarning, hideModal } = useModal();

  const handleDelete = () => {
    showWarning({
      title: "Deseja mesmo excluir esta tag?",
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
          "hover:border-secondary/40 hover:bg-neutral-80 transition-all duration-100 group shadow-md",
        )}
      >
        <span className="font-medium text-neutral-10 truncate mr-4 flex-1">
          {tagData.name}
        </span>
        <span className="flex-1 text-neutral-40">100h</span>
        <DropDownMenu
          items={[
            {
              label: "Editar",
              onClick: openTagModal,
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
      <EditTag
        title="Atualizar Tag"
        confirm={onEdit}
        defaultValues={tagData}
        inputLabel="Novo nome"
        confirmButtonIcon={<RxUpdate />}
        confirmButtonText="Atualizar"
      />
    </>
  );
};

export default Tag;
