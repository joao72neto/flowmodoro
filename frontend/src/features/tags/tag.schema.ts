import * as yup from "yup";

export type ICreateTag = yup.InferType<typeof CreateTagSchema>;

export const CreateTagSchema = yup.object({
  name: yup.string().required("O nome da tag é obrigatório"),
});
