import DropDownMenu from "../../../shared/components/DropDownMenu";

const Project = ({ name = "Project" }: { name: string }) => {
  return (
    <div className="p-4 rounded-lg bg-neutral-80 flex justify-between items-center border border-border">
      <span>{name}</span>
      <DropDownMenu items={[{ label: "Editar" }, { label: "Excluir" }]}>
        Clique
      </DropDownMenu>
    </div>
  );
};

export default Project;
