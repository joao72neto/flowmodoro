import * as yup from "yup";

export type ILoginSchema = yup.InferType<typeof LoginSchema>;

export const LoginSchema = yup.object({
  email: yup
    .string()
    .email("O e-mail é inválido")
    .required("O e-mail é obrigatório"),

  password: yup.string().required("A senha é obrigatória"),
});

export const passwordValidation = yup
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .matches(/\d/, "A senha deve conter pelo menos um número")
  .matches(
    /[@$!%*?&#]/,
    "A senha deve conter pelo menos um caractere especial (@$!%*?&#)",
  )
  .required("A senha é obrigatória");

export type IRegisterSchema = yup.InferType<typeof RegisterSchema>;

export const RegisterSchema = yup.object({
  name: yup
    .string()
    .required("O nome é obrigatório")
    .min(2, "O nome deve ter pelo menos 2 caracteres"),

  email: yup
    .string()
    .email("O e-mail é inválido")
    .required("O e-mail é obrigatório"),
  password: passwordValidation,

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

export type IResetPasswordSchema = yup.InferType<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = yup.object({
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .required("A confirmação de senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});
