import FormContainer from "./FormContainer";
import ReturnTitle from "../../../../shared/components/ReturnTitle";
import InputGroup from "../../../../shared/components/inputs/InputGroup";
import Stack from "../../../../shared/components/Stack";
import Button from "../../../../shared/components/buttons/Button/Button";
import { IoMdSend } from "react-icons/io";
import InputGroupWrapper from "../../../../shared/components/inputs/InputGroupWrapper";

const PasswordRecovery = ({ onReturn }: { onReturn: () => void }) => {
  return (
    <FormContainer>
      <ReturnTitle onClick={onReturn}>Recuperar Senha</ReturnTitle>

      <InputGroupWrapper>
        <InputGroup label="E-mail" placeholder="Digite o e-mail" />
      </InputGroupWrapper>

      <Stack align="left">
        <Button icon={<IoMdSend size={21} />}>Enviar</Button>
      </Stack>
    </FormContainer>
  );
};

export default PasswordRecovery;
