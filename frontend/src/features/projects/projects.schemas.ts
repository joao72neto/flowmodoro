import * as yup from "yup";

export type ICreateProject = yup.InferType<typeof CreateProjectSchema>;

export const CreateProjectSchema = yup.object({
  name: yup.string().required("O nome do projeto é obrigatório"),
});
