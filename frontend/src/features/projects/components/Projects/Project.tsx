import DropDownMenu from "../../../../shared/components/DropDownMenu";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { ProjectType } from "../../projects.types";

const Project = ({
  name = "Project",
  onDelete,
  onEdit,
}: {
  name: string;
  onDelete?: () => void;
  onEdit?: () => void;
}) => {
  return (
    <div className="p-4 rounded-lg bg-neutral-80 flex justify-between items-center border border-border">
      <span>{name}</span>
      <DropDownMenu
        items={[
          { label: "Editar", onClick: onEdit },
          { label: "Excluir", onClick: onDelete },
        ]}
      >
        <BsThreeDotsVertical size={20} />
      </DropDownMenu>
    </div>
  );
};

export default Project;
