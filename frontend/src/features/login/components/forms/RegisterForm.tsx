import FormContainer from "./FormContainer";
import ReturnTitle from "../../../../shared/components/ReturnTitle";
import InputGroup from "../../../../shared/components/inputs/InputGroup";
import Stack from "../../../../shared/components/Stack";
import Button from "../../../../shared/components/buttons/Button/Button";
import InputGroupWrapper from "../../../../shared/components/inputs/InputGroupWrapper";

import { CiCirclePlus } from "react-icons/ci";

const RegisterForm = ({ onReturn }: { onReturn: () => void }) => {
  return (
    <FormContainer>
      <ReturnTitle onClick={onReturn}>Cadastro</ReturnTitle>

      <InputGroupWrapper>
        <InputGroup label="E-mail" placeholder="Ex: exemplo@email.com" />
        <InputGroup label="Senha" placeholder="Digite a senha" />
        <InputGroup
          label="Confirmar Senha"
          placeholder="Digite a senha novamente"
        />
      </InputGroupWrapper>

      <Stack align="left">
        <Button icon={<CiCirclePlus size={21} />}>Cadastrar</Button>
      </Stack>
    </FormContainer>
  );
};

export default RegisterForm;
