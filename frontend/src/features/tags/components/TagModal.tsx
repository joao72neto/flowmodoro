import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import Input from "../../../shared/components/inputs/Input";
import Button from "../../../shared/components/buttons/Button";
import type { TagResponse } from "../tags.types";

import { MdOutlineAdd } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CreateTagSchema } from "../tags.schemas";
import type { useCreateTag, useUpdateTag } from "../hooks/useTags";

const TagModal = ({
  isOpen,
  defaultValues,

  title = "Nova tag",
  titleIcon = <IoMdPricetag />,

  inputLabel = "Nome",

  edit,
  save,

  projectId,
  confirmButtonText = "Criar",
  confirmButtonIcon = <MdOutlineAdd />,

  cancelButtonText = "Cancelar",
  cancelButtonIcon = <MdOutlineCancel />,
  close,

  loading,
}: {
  isOpen: boolean;
  defaultValues?: TagResponse;

  title: string;
  titleIcon?: React.ReactNode;

  inputLabel?: string;

  projectId: number;
  edit: ReturnType<typeof useUpdateTag>["mutate"];
  save: ReturnType<typeof useCreateTag>["mutate"];

  confirmButtonText?: string;
  confirmButtonIcon?: React.ReactNode;

  cancelButtonText?: string;
  cancelButtonIcon?: React.ReactNode;
  close: () => void;

  loading?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(CreateTagSchema),
    defaultValues: {
      name: defaultValues?.name || "",
    },
  });

  if (!isOpen) return null;

  const closeAndReset = () => {
    reset();
    close();
  };

  const onSubmit = (data: { name: string }) => {
    defaultValues
      ? edit(
          {
            id: defaultValues.id,
            data: {
              name: data.name,
              projectId: projectId,
            },
          },
          { onSuccess: closeAndReset },
        )
      : save({ name: data.name, projectId }, { onSuccess: closeAndReset });
  };

  return (
    <ModalContainer close={close}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <div className="flex items-center gap-3 text-xl">
          <span className="text-3xl text-secondary">{titleIcon}</span>
          <h1 className="font-bold">{title}</h1>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-left text-[18px]">
            {inputLabel}
          </label>
          <Input
            variant="secondary"
            placeholder="Nome da tag"
            error={errors.name?.message}
            {...register("name", {
              setValueAs: (value) => value.trim(),
            })}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 items-center justify-center">
          <Button
            type="button"
            icon={<span className="text-xl">{cancelButtonIcon}</span>}
            className="w-full text-md! sm:w-[150px] sm:p-2! sm:text-base!"
            variant="danger"
            disabled={loading}
            onClick={() => {
              reset();
              close();
            }}
          >
            {cancelButtonText}
          </Button>
          <Button
            type="submit"
            variant="secondary"
            icon={<span className="text-xl">{confirmButtonIcon}</span>}
            className="w-full text-md! sm:w-[150px] sm:p-2!"
            loading={loading}
          >
            {confirmButtonText}
          </Button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default TagModal;
