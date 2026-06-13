import Button from "../../../shared/components/buttons/Button";

import Input from "../../../shared/components/Input";
import DropDownMenu from "../../../shared/components/DropDownMenu";

const Projects = () => {
  return (
    <div className="flex flex-col gap-4 p-3 w-full h-full min-h-0">
      <div className="flex flex-col gap-4 items-center">
        <Button className="w-full">Novo Projeto</Button>
        <Input placeholder="pesquisa" className="border w-full" />
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-auto contain-content scrollbar-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Project key={item} name={`Project ${item}`} />
        ))}
      </div>
    </div>
  );
};

export default Projects;

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
