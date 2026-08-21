import * as yup from "yup";

export type ILoginSchema = yup.InferType<typeof LoginSchema>;

export const LoginSchema = yup.object({
  email: yup
    .string()
    .email("O e-mail é inválido")
    .required("O e-mail é obrigatório"),

  password: yup.string().required("A senha é obrigatória"),
});

export type IRegisterSchema = yup.InferType<typeof RegisterSchema>;

export const RegisterSchema = yup.object({
  email: yup
    .string()
    .email("O e-mail é inválido")
    .required("O e-mail é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),

  confirmPassword: yup
    .string()
    .required("A confirmação de senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});

export type IPasswordRecoverySchema = yup.InferType<
  typeof PasswordRecoverySchema
>;

export const PasswordRecoverySchema = yup.object({
  email: yup
    .string()
    .email("O e-mail é inválido")
    .required("O e-mail é obrigatório"),
});
