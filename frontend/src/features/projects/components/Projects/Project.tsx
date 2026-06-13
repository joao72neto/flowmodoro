import DropDownMenu from "../../../../shared/components/DropDownMenu";
import { BsThreeDotsVertical } from "react-icons/bs";

const Project = ({ name = "Project" }: { name: string }) => {
  return (
    <div className="p-4 rounded-lg bg-neutral-80 flex justify-between items-center border border-border">
      <span>{name}</span>
      <DropDownMenu items={[{ label: "Editar" }, { label: "Excluir" }]}>
        <BsThreeDotsVertical size={20} />
      </DropDownMenu>
    </div>
  );
};

export default Project;
