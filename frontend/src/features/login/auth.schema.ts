import * as yup from "yup";

export type ILoginSchema = yup.InferType<typeof LoginSchema>;

export const LoginSchema = yup.object({
  email: yup
    .string()
    .email("O e-mail é inválido")
    .required("O e-mail é obrigatório"),

  password: yup.string().required("A senha é obrigatória"),
});
