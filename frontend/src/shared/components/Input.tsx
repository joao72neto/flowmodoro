import clsx from "clsx";
import type { VariantType } from "../globals.types";

const focusVariants = {
  primary: "focus-within:border-primary!",
  secondary: "focus-within:border-secondary!",
  danger: "focus-within:border-danger!",
  danger2: "focus-within:border-danger-2!",
  success: "focus-within:border-success!",
  success2: "focus-within:border-success-2!",
};

const iconFocusVariants = {
  primary: "group-focus-within:text-primary",
  secondary: "group-focus-within:text-secondary",
  danger: "group-focus-within:text-danger",
  danger2: "group-focus-within:text-danger-2",
  success: "group-focus-within:text-success",
  success2: "group-focus-within:text-success-2",
};

interface InputProps {
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  disabled?: boolean;
  variant?: VariantType;
  icon?: React.ReactNode;
}

function Input({
  placeholder,
  onKeyDown,
  onChange,
  value,
  className,
  disabled,
  variant = "primary",
  icon,
}: InputProps) {
  return (
    <div
      className={clsx(
        "group relative flex items-center w-full transition-all duration-200",
        "rounded-md border border-border bg-neutral-80/50",
        focusVariants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {icon && (
        <div
          className={clsx(
            "absolute left-3 transition-colors duration-200 text-neutral-40",
            iconFocusVariants[variant],
          )}
        >
          {icon}
        </div>
      )}
      <input
        disabled={disabled}
        className={clsx(
          "w-full py-2 bg-transparent text-neutral-10 focus:outline-none",
          icon ? "pl-10 pr-4" : "px-4",
        )}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

export default Input;
