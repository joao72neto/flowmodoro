import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/buttons/Button";
import type { CreateProjectType, ProjectType } from "../projects.types";
import { useState } from "react";

import { MdOutlineAdd } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { GoProject } from "react-icons/go";

const ProjectModal = ({
  isOpen,
  defaultValues,

  title = "Novo projeto",
  titleIcon = <GoProject />,

  inputLabel = "Nome",

  confirm,
  confirmButtonText = "Criar",
  confirmButtonIcon = <MdOutlineAdd />,

  cancelButtonText = "Cancelar",
  cancelButtonIcon = <MdOutlineCancel />,
  close,
}: {
  isOpen: boolean;
  defaultValues?: ProjectType;

  title: string;
  titleIcon?: React.ReactNode;

  inputLabel?: string;

  confirm: (project: CreateProjectType | ProjectType) => void;
  confirmButtonText?: string;
  confirmButtonIcon?: React.ReactNode;

  cancelButtonText?: string;
  cancelButtonIcon?: React.ReactNode;
  close: () => void;
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(defaultValues?.name || "");

  return (
    <ModalContainer close={!name ? close : undefined}>
      <div className="flex items-center gap-3 text-xl">
        <span className="text-3xl">{titleIcon}</span>
        <h1 className="font-bold">{title}</h1>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-left text-[18px]">{inputLabel}</label>
        <Input
          placeholder="Nome do projeto"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <Button
          icon={<span className="text-xl">{confirmButtonIcon}</span>}
          className="w-full text-sm! p-1.5! sm:w-[150px] sm:p-2!"
          onClick={() => {
            confirm(defaultValues ? { id: defaultValues.id, name } : { name });
            close();
          }}
        >
          {confirmButtonText}
        </Button>
        <Button
          icon={<span className="text-xl">{cancelButtonIcon}</span>}
          className="w-full text-sm! p-1.5! sm:w-[150px] sm:p-2! sm:text-base!"
          variant="danger"
          onClick={close}
        >
          {cancelButtonText}
        </Button>
      </div>
    </ModalContainer>
  );
};

export default ProjectModal;
