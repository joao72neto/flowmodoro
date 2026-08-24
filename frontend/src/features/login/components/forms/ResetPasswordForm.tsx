import FormContainer from "./FormContainer";
import ReturnTitle from "../../../../shared/components/ReturnTitle";
import InputGroup from "../../../../shared/components/inputs/InputGroup";
import Stack from "../../../../shared/components/Stack";
import Button from "../../../../shared/components/buttons/Button/Button";
import InputGroupWrapper from "../../../../shared/components/inputs/InputGroupWrapper";
import { IoKeyOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPasswordSchema, type IResetPasswordSchema } from "../../auth.schema";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = ({ code }: { code: string }) => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IResetPasswordSchema>({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const onValid = (data: IResetPasswordSchema) => {
    // Log do código de recuperação para propósitos de debug/teste
    console.log("Alterando senha com o código:", code, data);
    reset();
    navigate("/login?alert=reset_success");
  };

  return (
    <FormContainer onSubmit={handleSubmit(onValid)} direction={1}>
      <ReturnTitle path="/login">Alterar Senha</ReturnTitle>

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
        <Button icon={<IoKeyOutline size={21} />}>Alterar Senha</Button>
      </Stack>
    </FormContainer>
  );
};

export default ResetPasswordForm;
