import Button from "../../../../shared/components/buttons/Button/Button";
import ReturnTitle from "../../../../shared/components/ReturnTitle";
import InputGroup from "../../../../shared/components/inputs/InputGroup";
import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { IoLogInOutline } from "react-icons/io5";
import InputGroupWrapper from "../../../../shared/components/inputs/InputGroupWrapper";
import FormContainer from "./FormContainer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema, type ILoginSchema } from "../../auth.schema";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useLogin } from "../../useAuthOperations";

const LoginForm = ({
  onRegister,
}: {
  onForgorPassword?: () => void;
  onRegister?: () => void;
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const alertParam = searchParams.get("alert");

  const {
    mutate: doLogin,
    error: authError,
    isPending: isSubmitting,
  } = useLogin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ILoginSchema>({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const onValid = async (data: ILoginSchema) => {
    doLogin(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          reset();
          navigate("/");
        },
      },
    );
  };

  return (
    <FormContainer onSubmit={handleSubmit(onValid)} direction={-1}>
      <ReturnTitle path="/">Login</ReturnTitle>

      {authError && (
        <div className="p-3 text-sm text-danger bg-danger/10 border border-danger/30 rounded-md text-left font-medium animate-in fade-in slide-in-from-top-1">
          {authError.message}
        </div>
      )}

      {alertParam === "missing_code" && (
        <div className="p-3 text-sm text-danger bg-danger/10 border border-danger/30 rounded-md text-left font-medium animate-in fade-in slide-in-from-top-1">
          Código de recuperação inválido ou ausente. Por favor, solicite a
          recuperação de senha novamente.
        </div>
      )}

      {alertParam === "reset_success" && (
        <div className="p-3 text-sm text-success bg-success/10 border border-success/30 rounded-md text-left font-medium animate-in fade-in slide-in-from-top-1">
          Senha alterada com sucesso! Faça login com suas novas credenciais.
        </div>
      )}

      {alertParam === "not_available" && (
        <div className="p-3 text-sm text-danger bg-danger/10 border border-danger/30 rounded-md text-left font-medium animate-in fade-in slide-in-from-top-1">
          A página de alteração de senha ainda não está disponível.
        </div>
      )}

      <InputGroupWrapper>
        <InputGroup
          register={register("email")}
          error={errors.email}
          label="E-mail"
          placeholder="Ex: exemplo@email.com"
        />

        <InputGroup
          password
          register={register("password")}
          error={errors.password}
          label="Senha"
          placeholder="Digite a sua senha"
        />

        <div className="flex items-center gap-2 text-sm text-neutral-20">
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
        <Button icon={<IoLogInOutline size={21} />} loading={isSubmitting}>
          Entrar
        </Button>
      </Stack>
    </FormContainer>
  );
};

export default LoginForm;
