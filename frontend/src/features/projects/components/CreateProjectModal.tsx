import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import Input from "../../../shared/components/Input";
import Stack from "../../../shared/components/Stack";
import Button from "../../../shared/components/buttons/Button";

const CreateProjectModal = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <ModalContainer close={close}>
      <h1 className="font-bold text-xl">Novo Projeto</h1>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-left">Nome</label>
        <Input placeholder="Nome do projeto" />
      </div>

      <Stack direction="row">
        <Button className="w-[120px]" onClick={close}>
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
