import Button from "../../../../shared/components/buttons/Button";

import Input from "../../../../shared/components/Input";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import CreateProjectModal from "../CreateProjectModal";
import Project from "./Project";

const Projects = () => {
  const { Modal: CreateProject, openModal: openProjectModal } =
    useModalFactory(CreateProjectModal);

  return (
    <>
      <div className="flex flex-col gap-4 p-3 w-full h-full min-h-0">
        <div className="flex flex-col gap-4 items-center">
          <Button className="w-full" onClick={openProjectModal}>
            Novo Projeto
          </Button>
          <Input placeholder="Pesquisar projeto" className="border w-full" />
        </div>
        <div className="flex-1 flex flex-col gap-2 overflow-auto contain-content scrollbar-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <Project key={item} name={`Project ${item}`} />
          ))}
        </div>
      </div>
      <CreateProject />
    </>
  );
};

export default Projects;
