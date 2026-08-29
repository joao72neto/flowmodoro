import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import Input from "../../../shared/components/inputs/Input";
import Button from "../../../shared/components/buttons/Button/Button";
import clsx from "clsx";

import { MdOutlineAdd } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { GoProject } from "react-icons/go";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CreateProjectSchema } from "../project.schema";

import type { ProjectDTO } from "../dtos/projects-response";

import type { useCreateProject, useUpdateProject } from "../hooks/useProjects";
import type { ProjectUpdateDTO } from "../dtos/projects-request";

import { v4 as uuidv4 } from "uuid";

import { useEffect, useMemo } from "react";
import {
  PROJECT_COLORS,
  getRandomProjectColor,
  getStableProjectColor,
} from "../consts/project-colors";

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

  loading,
}: {
  isOpen: boolean;
  defaultValues?: ProjectDTO;

  title?: string;
  titleIcon?: React.ReactNode;

  inputLabel?: string;

  edit?: ReturnType<typeof useUpdateProject>["mutate"];
  save?: ReturnType<typeof useCreateProject>["mutate"];

  confirmButtonText?: string;
  confirmButtonIcon?: React.ReactNode;

  cancelButtonText?: string;
  cancelButtonIcon?: React.ReactNode;
  close: () => void;

  loading?: boolean;
}) => {
  const initialColor = useMemo(() => {
    if (defaultValues) {
      return getStableProjectColor(defaultValues.id, defaultValues.color);
    }
    return getRandomProjectColor();
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(CreateProjectSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      color: initialColor,
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (isOpen) {
      reset({
        name: defaultValues?.name || "",
        color: defaultValues
          ? getStableProjectColor(defaultValues.id, defaultValues.color)
          : getRandomProjectColor(),
      });
    }
  }, [isOpen, defaultValues, reset]);

  const closeAndReset = () => {
    reset({
      name: "",
      color: getRandomProjectColor(),
    });
    close();
  };

  const onSubmit = (data: ProjectUpdateDTO) => {
    if (defaultValues && edit) {
      edit({ id: defaultValues.id, data }, { onSuccess: closeAndReset });
      return;
    }

    if (save) {
      save(
        { id: uuidv4(), ...data },
        {
          onSuccess: closeAndReset,
        },
      );
    }
  };

  return (
    <ModalContainer isOpen={isOpen} close={close}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <div className="flex items-center gap-3 text-xl">
          <span className="text-3xl" style={{ color: selectedColor }}>
            {titleIcon}
          </span>
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

        <div className="flex flex-col gap-2">
          <label className="font-bold text-left text-[18px]">Cor</label>
          <div className="flex flex-wrap gap-2.5 items-center">
            {PROJECT_COLORS.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setValue("color", color, { shouldValidate: true })
                  }
                  className={clsx(
                    "w-8 h-8 rounded-full cursor-pointer transition-all duration-150 relative flex items-center justify-center",
                    isSelected
                      ? "scale-110 ring-2 ring-offset-2 ring-neutral-10 ring-offset-neutral-80"
                      : "hover:scale-105 opacity-80 hover:opacity-100",
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              );
            })}
          </div>
          {errors.color?.message && (
            <span className="text-xs text-danger text-left">
              {errors.color.message}
            </span>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 items-center justify-center">
          <Button
            type="button"
            icon={<span className="text-xl">{cancelButtonIcon}</span>}
            className="w-full text-md! sm:w-[150px] sm:p-2! sm:text-base!"
            variant="secondary40"
            onClick={() => {
              reset();
              close();
            }}
            disabled={loading}
          >
            {cancelButtonText}
          </Button>
          <Button
            type="submit"
            icon={<span className="text-xl">{confirmButtonIcon}</span>}
            className="w-full text-md! sm:w-[150px] sm:p-2!"
          >
            {confirmButtonText}
          </Button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default ProjectModal;
