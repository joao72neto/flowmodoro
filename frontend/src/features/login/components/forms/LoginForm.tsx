import Button from "../../../../shared/components/buttons/Button/Button";
import ReturnTitle from "../../../../shared/components/ReturnTitle";
import InputGroup from "../../../../shared/components/inputs/InputGroup";
import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { IoLogInOutline } from "react-icons/io5";
import InputGroupWrapper from "../../../../shared/components/inputs/InputGroupWrapper";
import FormContainer from "./FormContainer";

const LoginForm = ({
  onForgorPassword,
  onRegister,
}: {
  onForgorPassword?: () => void;
  onRegister?: () => void;
}) => {
  return (
    <FormContainer direction={-1}>
      <ReturnTitle path="/">Login</ReturnTitle>

      <InputGroupWrapper>
        <InputGroup label="E-mail" placeholder="Ex: exemplo@email.com" />
        <InputGroup label="Senha" placeholder="Digite a sua senha" />

        <div className="flex items-center gap-2 text-sm text-neutral-20">
          <span
            className={clsx(
              "border-r border-border pr-2 hover:cursor-pointer",
              "hover:text-neutral-10 hover:underline",
            )}
            onClick={onForgorPassword}
          >
            Esqueceu a senha?
          </span>
          <span
            className={clsx(
              "pr-2 hover:cursor-pointer",
              "hover:text-neutral-10 hover:underline",
            )}
            onClick={onRegister}
          >
            Cadastre-se
          </span>
        </div>
      </InputGroupWrapper>

      <Stack align="left">
        <Button icon={<IoLogInOutline size={21} />}>Entrar</Button>
      </Stack>
    </FormContainer>
  );
};

export default LoginForm;
