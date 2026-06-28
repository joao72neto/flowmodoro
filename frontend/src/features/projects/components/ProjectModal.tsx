import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import Input from "../../../shared/components/inputs/Input";
import Button from "../../../shared/components/buttons/Button";
import type { ProjectPayload, ProjectResponse } from "../projects.types";

import { MdOutlineAdd } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { GoProject } from "react-icons/go";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CreateProjectSchema } from "../projects.schemas";

const ProjectModal = ({
  isOpen,
  defaultValues,

  title = "Novo projeto",
  titleIcon = <GoProject />,

  inputLabel = "Nome",

  edit,
  save,

  confirmButtonText = "Criar",
  confirmButtonIcon = <MdOutlineAdd />,

  cancelButtonText = "Cancelar",
  cancelButtonIcon = <MdOutlineCancel />,
  close,
}: {
  isOpen: boolean;
  defaultValues?: ProjectResponse;

  title: string;
  titleIcon?: React.ReactNode;

  inputLabel?: string;

  edit: ({ id, data }: { id: number; data: ProjectPayload }) => void;
  save: (data: ProjectPayload) => void;

  confirmButtonText?: string;
  confirmButtonIcon?: React.ReactNode;

  cancelButtonText?: string;
  cancelButtonIcon?: React.ReactNode;
  close: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(CreateProjectSchema),
    defaultValues: {
      name: defaultValues?.name || "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: { name: string }) => {
    defaultValues ? edit({ id: defaultValues.id, data }) : save(data);
    reset();
    close();
  };

  return (
    <ModalContainer close={close}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <div className="flex items-center gap-3 text-xl">
          <span className="text-3xl">{titleIcon}</span>
          <h1 className="font-bold">{title}</h1>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-left text-[18px]">
            {inputLabel}
          </label>
          <Input
            placeholder="Nome do projeto"
            error={errors.name?.message}
            {...register("name", {
              setValueAs: (value) => value.trim(),
            })}
          />
        </div>

        <div className="flex flex-col min-[350px]:flex-row gap-3 items-center justify-center">
          <Button
            type="button"
            icon={<span className="text-xl">{cancelButtonIcon}</span>}
            className="w-full text-md! p-1.5! sm:w-[150px] sm:p-2! sm:text-base!"
            variant="danger"
            onClick={() => {
              reset();
              close();
            }}
          >
            {cancelButtonText}
          </Button>
          <Button
            type="submit"
            icon={<span className="text-xl">{confirmButtonIcon}</span>}
            className="w-full text-md! p-1.5! sm:w-[150px] sm:p-2!"
          >
            {confirmButtonText}
          </Button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default ProjectModal;
