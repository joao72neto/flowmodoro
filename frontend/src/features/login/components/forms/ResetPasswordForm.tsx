import FormContainer from "./FormContainer";
import ReturnTitle from "../../../../shared/components/ReturnTitle";
import InputGroup from "../../../../shared/components/inputs/InputGroup";
import Stack from "../../../../shared/components/Stack";
import Button from "../../../../shared/components/buttons/Button/Button";
import InputGroupWrapper from "../../../../shared/components/inputs/InputGroupWrapper";
import { IoKeyOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ResetPasswordSchema,
  type IResetPasswordSchema,
} from "../../auth.schema";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../../useAuthOperations";

const ResetPasswordForm = ({ code: _code }: { code: string }) => {
  const navigate = useNavigate();

  const {
    mutate: doResetPassword,
    isPending: isSubmitting,
    error: authError,
  } = useResetPassword();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IResetPasswordSchema>({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const onValid = async (data: IResetPasswordSchema) => {
    doResetPassword(
      { newPassword: data.password, code: _code },
      {
        onSuccess: () => {
          reset();
          navigate("/login?alert=reset_success");
        },
      },
    );
  };

  return (
    <FormContainer onSubmit={handleSubmit(onValid)} direction={1}>
      <ReturnTitle path="/login">Alterar Senha</ReturnTitle>

      {authError && (
        <div className="p-3 text-sm text-danger bg-danger/10 border border-danger/30 rounded-md text-left font-medium animate-in fade-in slide-in-from-top-1">
          {authError.message}
        </div>
      )}

      <InputGroupWrapper>
        <InputGroup
          password
          register={register("password")}
          error={errors.password}
          label="Nova Senha"
          placeholder="Digite a nova senha"
        />

        <InputGroup
          password
          register={register("confirmPassword")}
          error={errors.confirmPassword}
          label="Confirmar Nova Senha"
          placeholder="Confirme a nova senha"
        />
      </InputGroupWrapper>

      <Stack align="left">
        <Button icon={<IoKeyOutline size={21} />} loading={isSubmitting}>
          Alterar Senha
        </Button>
      </Stack>
    </FormContainer>
  );
};

export default ResetPasswordForm;
