import { BsThreeDotsVertical } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { RxTrash } from "react-icons/rx";
import clsx from "clsx";
import { IoMdPricetag } from "react-icons/io";
import { GoProject } from "react-icons/go";
import { IoTimeOutline } from "react-icons/io5";
import DropdownMenu from "../../../../shared/components/Dropdown/DropdownMenu";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { useModal } from "../../../../shared/contexts/modal/modal.context";
import type { ProjectDTO } from "../../offline/project.dtos";

const Project = ({
  projectData,
  onDelete,
  onEdit,
  onSelectTags,
}: {
  projectData: ProjectDTO;
  onDelete?: () => void;
  onEdit?: () => void;
  onSelectTags?: (project: ProjectDTO) => void;
}) => {
  const { showDefault, hideModal } = useModal();

  const handleDelete = () => {
    showDefault({
      title: "Deseja mesmo excluir este projeto?",
      message: "Esta operação não pode ser desfeita.",
      cancel: hideModal,
      action: () => {
        onDelete?.();
      },
    });
  };

  return (
    <div
      className={clsx(
        "p-4 rounded-xl bg-neutral-80/40 border border-border flex items-center justify-between shadow-md",
        "hover:border-neutral-60 hover:bg-neutral-80/85 hover:shadow-lg transition-all duration-200 group relative",
      )}
    >
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <GoProject className="text-primary/70 shrink-0" size={18} />
          <span className="font-semibold text-neutral-10 text-sm sm:text-base truncate pr-2">
            {projectData.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-40">
          <span className="flex items-center gap-1">
            <IoTimeOutline className="shrink-0" size={13} />
            <span>
              {projectData?.totalFocus && projectData.totalFocus > 0
                ? formatToHour(projectData.totalFocus)
                : "--:--:--"}
            </span>
          </span>
          <span className="text-neutral-40/40">•</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectTags?.(projectData);
            }}
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <IoMdPricetag className="shrink-0" size={13} />
            <span>Ver Tags</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <DropdownMenu
          align="right"
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
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Project;
