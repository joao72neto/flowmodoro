import FormContainer from "./FormContainer";
import ReturnTitle from "../../../../shared/components/ReturnTitle";
import InputGroup from "../../../../shared/components/inputs/InputGroup";
import Stack from "../../../../shared/components/Stack";
import Button from "../../../../shared/components/buttons/Button/Button";
import { IoMdSend } from "react-icons/io";

const PasswordRecovery = ({ onReturn }: { onReturn: () => void }) => {
  return (
    <FormContainer>
      <ReturnTitle className="mb-4" onClick={onReturn}>
        Recuperar Senha
      </ReturnTitle>

      <InputGroup label="E-mail" placeholder="Digite o e-mail" />

      <Stack align="left" className="mt-4">
        <Button icon={<IoMdSend size={21} />}>Enviar</Button>
      </Stack>
    </FormContainer>
  );
};

export default PasswordRecovery;
