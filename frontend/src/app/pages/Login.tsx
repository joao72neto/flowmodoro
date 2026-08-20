import Input from "../../shared/components/inputs/Input";
import Button from "../../shared/components/buttons/Button/Button";
import clsx from "clsx";
import Stack from "../../shared/components/Stack";
import { IoLogInOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { PiCaretLeftBold } from "react-icons/pi";

const Login = () => {
  return (
    <div className="flex min-h-0 h-screen">
      <div
        className={clsx(
          "flex flex-col border-r border-border p-6 w-full gap-4",
          "max-w-xl shadow-[8px_0_20px_rgba(0,0,0,0.30)] z-10",
        )}
      >
        <div className="flex items-center gap-2">
          <img src="/flowmodoro-icon.svg" alt="App logo" className="w-10" />
          <p className="text-2xl">Flowmodoro</p>
        </div>

        <section className="flex flex-col justify-center gap-4 flex-1">
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
        </section>
      </div>
      <div className="flex items-center flex-1 bg-neutral-20"></div>
    </div>
  );
};

export default Login;

const ReturnTitle = ({
  children,
  path,
  className,
}: {
  children: string;
  path?: string;
  className?: string;
}) => {
  const navigate = useNavigate();

  return (
    <div className={clsx("flex items-center", className)}>
      <button
        className="cursor-pointer hover:-translate-x-1 duration-100 pr-1"
        onClick={() => (path ? navigate(path) : window.history.back())}
      >
        <PiCaretLeftBold size={24} />
      </button>
      <h1 className={"text-2xl"}>{children}</h1>
    </div>
  );
};
