import DropDownMenu from "../../../../shared/components/Dropdown/DropdownMenu";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { TagResponse } from "../../tags.types";
import { MdModeEditOutline } from "react-icons/md";
import { RxTrash } from "react-icons/rx";
import clsx from "clsx";
import { useModal } from "../../../../shared/modal.context";
import { IoMdPricetag } from "react-icons/io";
import { IoTimeOutline } from "react-icons/io5";

const Tag = ({
  tagData,
  onDelete,
  onEdit,
}: {
  tagData: TagResponse;
  onDelete?: () => void;
  onEdit?: () => void;
}) => {
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
    <div
      className={clsx(
        "p-4 rounded-xl bg-neutral-80/40 border border-border flex items-center justify-between",
        "hover:border-secondary/40 hover:bg-neutral-80/85 hover:shadow-lg transition-all duration-200 group relative",
      )}
    >
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <IoMdPricetag className="text-secondary shrink-0" size={16} />
          <span className="font-semibold text-neutral-10 text-sm sm:text-base truncate pr-2">
            {tagData.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-40">
          <span className="flex items-center gap-1">
            <IoTimeOutline className="shrink-0" size={13} />
            <span>100h</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <DropDownMenu
          items={[
            {
              label: "Editar",
              onClick: onEdit,
              icon: <MdModeEditOutline />,
            },
            { label: "Excluir", onClick: handleDelete, icon: <RxTrash /> },
          ]}
        >
          <div
            className={clsx(
              "p-1.5 rounded-md hover:bg-neutral-70/60 transition-colors text-neutral-40",
              "group-hover:text-neutral-10 cursor-pointer",
            )}
          >
            <BsThreeDotsVertical size={18} />
          </div>
        </DropDownMenu>
      </div>
    </div>
  );
};

export default Tag;
