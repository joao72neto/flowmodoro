import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import Input from "../../../shared/components/inputs/Input";
import Button from "../../../shared/components/buttons/Button";
import type { CreateTagType, TagType } from "../tags.types";

import { MdOutlineAdd } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CreateTagSchema } from "../tags.schemas";

const TagModal = ({
  isOpen,
  defaultValues,

  title = "Nova tag",
  titleIcon = <IoMdPricetag />,

  inputLabel = "Nome",

  confirm,
  confirmButtonText = "Criar",
  confirmButtonIcon = <MdOutlineAdd />,

  cancelButtonText = "Cancelar",
  cancelButtonIcon = <MdOutlineCancel />,
  close,
}: {
  isOpen: boolean;
  defaultValues?: TagType;

  title: string;
  titleIcon?: React.ReactNode;

  inputLabel?: string;

  confirm: (tag: CreateTagType | TagType) => void;
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
    resolver: yupResolver(CreateTagSchema),
    defaultValues: {
      name: defaultValues?.name || "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: { name: string }) => {
    confirm(
      defaultValues
        ? { ...defaultValues, name: data.name }
        : { name: data.name, projectId: 0 },
    );
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
            {...register("name")}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Button
            type="submit"
            variant="secondary"
            icon={<span className="text-xl">{confirmButtonIcon}</span>}
            className="w-full text-md! p-1.5! sm:w-[150px] sm:p-2!"
          >
            {confirmButtonText}
          </Button>
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
        </div>
      </form>
    </ModalContainer>
  );
};

export default TagModal;
