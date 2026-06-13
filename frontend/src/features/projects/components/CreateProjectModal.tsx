import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import Input from "../../../shared/components/Input";
import Stack from "../../../shared/components/Stack";
import Button from "../../../shared/components/buttons/Button";
import type { CreateProjectType } from "../projects.types";
import { useState } from "react";

const CreateProjectModal = ({
  isOpen,
  close,
  confirm,
}: {
  isOpen: boolean;
  confirm: (project: CreateProjectType) => void;
  close: () => void;
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState("");

  return (
    <ModalContainer close={!name ? close : undefined}>
      <h1 className="font-bold text-xl">Novo Projeto</h1>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-left">Nome</label>
        <Input
          placeholder="Nome do projeto"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <Stack direction="row">
        <Button
          className="w-[120px]"
          onClick={() => {
            confirm({ name });
            close();
          }}
        >
          Criar
        </Button>
        <Button className="w-[120px]" variant="danger" onClick={close}>
          Cancelar
        </Button>
      </Stack>
    </ModalContainer>
  );
};

export default CreateProjectModal;
