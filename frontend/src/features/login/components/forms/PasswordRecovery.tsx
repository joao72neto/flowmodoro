import FormContainer from "./FormContainer";
import ReturnTitle from "../../../../shared/components/ReturnTitle";
import InputGroup from "../../../../shared/components/inputs/InputGroup";
import Stack from "../../../../shared/components/Stack";
import Button from "../../../../shared/components/buttons/Button/Button";
import { IoMdSend } from "react-icons/io";
import InputGroupWrapper from "../../../../shared/components/inputs/InputGroupWrapper";

import {
  PasswordRecoverySchema,
  type IPasswordRecoverySchema,
} from "../../auth.schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRecoverPassword } from "../../useAuthOperations";

const PasswordRecovery = ({ onReturn }: { onReturn: () => void }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    mutate: doRecoverPassword,
    isPending: isSubmitting,
    error: authError,
  } = useRecoverPassword();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IPasswordRecoverySchema>({
    resolver: yupResolver(PasswordRecoverySchema),
    mode: "onChange",
  });

  const onValid = async (data: IPasswordRecoverySchema) => {
    doRecoverPassword(data.email, {
      onSuccess: () => {
        reset();
        setSuccessMessage(
          "Instruções de recuperação foram enviadas para seu e-mail.",
        );
      },
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit(onValid)} direction={1}>
      <ReturnTitle onClick={onReturn}>Recuperar Senha</ReturnTitle>

      {authError && (
        <div className="p-3 text-sm text-danger bg-danger/10 border border-danger/30 rounded-md text-left font-medium animate-in fade-in slide-in-from-top-1">
          {authError.message}
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-sm text-success bg-success/10 border border-success/30 rounded-md text-left font-medium animate-in fade-in slide-in-from-top-1">
          {successMessage}
        </div>
      )}

      <InputGroupWrapper>
        <InputGroup
          register={register("email")}
          error={errors.email}
          label="E-mail"
          placeholder="Digite o e-mail"
        />
      </InputGroupWrapper>

      <Stack align="left">
        <Button icon={<IoMdSend size={21} />} loading={isSubmitting}>
          Enviar
        </Button>
      </Stack>
    </FormContainer>
  );
};

export default PasswordRecovery;
