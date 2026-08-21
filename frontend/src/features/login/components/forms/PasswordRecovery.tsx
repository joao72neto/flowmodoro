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

const PasswordRecovery = ({ onReturn }: { onReturn: () => void }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IPasswordRecoverySchema>({
    resolver: yupResolver(PasswordRecoverySchema),
    mode: "onChange",
  });

  const onValid = () => {
    reset();
    onReturn();
  };

  return (
    <FormContainer onSubmit={handleSubmit(onValid)} direction={1}>
      <ReturnTitle onClick={onReturn}>Recuperar Senha</ReturnTitle>

      <InputGroupWrapper>
        <InputGroup
          register={register("email")}
          error={errors.email}
          label="E-mail"
          placeholder="Digite o e-mail"
        />
      </InputGroupWrapper>

      <Stack align="left">
        <Button icon={<IoMdSend size={21} />}>Enviar</Button>
      </Stack>
    </FormContainer>
  );
};

export default PasswordRecovery;
