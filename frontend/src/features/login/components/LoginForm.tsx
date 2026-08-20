import Button from "../../../shared/components/buttons/Button/Button";
import ReturnTitle from "../../../shared/components/ReturnTitle";
import Input from "../../../shared/components/inputs/Input";
import clsx from "clsx";
import Stack from "../../../shared/components/Stack";
import { IoLogInOutline } from "react-icons/io5";

const LoginForm = () => {
  return (
    <>
      <ReturnTitle className="mb-4">Login</ReturnTitle>

      <div className="flex flex-col gap-2">
        <label>E-mail</label>
        <Input placeholder="Ex: exemplo@email.com" />
      </div>

      <div className="flex flex-col gap-2">
        <label>Senha</label>
        <Input placeholder="Digite a sua senha" />
      </div>

      <div className="flex items-center gap-2 text-sm text-neutral-20">
        <a
          href="/"
          className={clsx(
            "border-r border-border pr-2",
            "hover:text-neutral-10 hover:underline",
          )}
        >
          Esqueceu a senha?
        </a>
        <a href="/" className="hover:text-neutral-10 hover:underline">
          Cadastre-se
        </a>
      </div>

      <Stack align="left" className="mt-4">
        <Button icon={<IoLogInOutline size={21} />}>Entrar</Button>
      </Stack>
    </>
  );
};

export default LoginForm;
