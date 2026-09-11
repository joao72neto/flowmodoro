import FormContainer from "./FormContainer";
import ReturnTitle from "../../../../shared/components/ReturnTitle";
import InputGroup from "../../../../shared/components/inputs/InputGroup";
import Stack from "../../../../shared/components/Stack";
import Button from "../../../../shared/components/buttons/Button/Button";
import InputGroupWrapper from "../../../../shared/components/inputs/InputGroupWrapper";

import { CiCirclePlus } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterSchema, type IRegisterSchema } from "../../auth.schema";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../useAuthOperations";

const RegisterForm = ({ onReturn }: { onReturn: () => void }) => {
  const navigate = useNavigate();

  const {
    mutate: doRegister,
    isPending: isSubmitting,
    error: authError,
  } = useRegister();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IRegisterSchema>({
    resolver: yupResolver(RegisterSchema),
    mode: "onChange",
  });

  const onValid = async (data: IRegisterSchema) => {
    doRegister(
      {
        email: data.email,
        password: data.password,
        name: data.name,
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
    <FormContainer onSubmit={handleSubmit(onValid)} direction={1}>
      <ReturnTitle onClick={onReturn}>Cadastro</ReturnTitle>

      {authError && (
        <div className="p-3 text-sm text-danger bg-danger/10 border border-danger/30 rounded-md text-left font-medium animate-in fade-in slide-in-from-top-1">
          {authError.message}
        </div>
      )}

      <InputGroupWrapper>
        <InputGroup
          register={register("name")}
          error={errors.name}
          label="Nome"
          placeholder="Seu nome completo"
        />

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
          placeholder="Digite a senha"
        />

        <InputGroup
          password
          register={register("confirmPassword")}
          error={errors.confirmPassword}
          label="Confirmar Senha"
          placeholder="Digite a senha novamente"
        />
      </InputGroupWrapper>

      <Stack align="left">
        <Button icon={<CiCirclePlus size={21} />} loading={isSubmitting}>
          Cadastrar
        </Button>
      </Stack>
    </FormContainer>
  );
};

export default RegisterForm;
