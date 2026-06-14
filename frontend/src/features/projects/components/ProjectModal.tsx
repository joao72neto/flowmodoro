import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/buttons/Button";
import type { CreateProjectType, ProjectType } from "../projects.types";
import { useState } from "react";

import { GoPlus } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";
import { GoProject } from "react-icons/go";

const ProjectModal = ({
  isOpen,
  defaultValues,

  title = "Novo projeto",
  titleIcon = <GoProject size={30} />,

  inputLabel = "Nome",

  confirm,
  confirmButtonText = "Criar",
  confirmButtonIcon = <GoPlus size={26} />,

  cancelButtonText = "Cancelar",
  cancelButtonIcon = <MdOutlineCancel size={26} />,
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
      <div className="flex items-center gap-3">
        {titleIcon}
        <h1 className="font-bold text-xl">{title}</h1>
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
          icon={confirmButtonIcon}
          className="w-full text-sm! p-1.5! sm:w-[150px] sm:p-2!"
          onClick={() => {
            confirm(defaultValues ? { id: defaultValues.id, name } : { name });
            close();
          }}
        >
          {confirmButtonText}
        </Button>
        <Button
          icon={cancelButtonIcon}
          className="w-full text-sm! p-1.5! sm:w-[150px] sm:p-2!"
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
