import Input from "./Input";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { FieldError } from "react-hook-form";

const InputGroup = ({
  label = "Label",
  placeholder = "Digite o valor",
  register,
  error,
  password,
}: {
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  password?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <Input
        {...register}
        error={error?.message}
        placeholder={placeholder}
        password={password}
      />
    </div>
  );
};

export default InputGroup;
