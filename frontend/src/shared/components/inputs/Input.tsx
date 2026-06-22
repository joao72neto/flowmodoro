import clsx from "clsx";
import type { VariantType } from "../../globals.types";
import { forwardRef, type InputHTMLAttributes } from "react";

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

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: VariantType;
  icon?: React.ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder,
      className,
      disabled,
      variant = "primary",
      icon,
      error,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <div
          className={clsx(
            "group relative flex items-center w-full transition-all duration-200",
            "rounded-md border bg-neutral-80/50",
            error ? "border-danger!" : "border-border",
            !error && focusVariants[variant],
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          {icon && (
            <div
              className={clsx(
                "absolute left-3 transition-colors duration-200",
                error
                  ? "text-danger!"
                  : clsx("text-neutral-40", iconFocusVariants[variant]),
              )}
            >
              {icon}
            </div>
          )}
          <input
            {...props}
            ref={ref}
            disabled={disabled}
            className={clsx(
              "w-full py-2 bg-transparent text-neutral-10 focus:outline-none",
              icon ? "pl-10 pr-4" : "px-4",
            )}
            placeholder={placeholder}
          />
        </div>
        {error && (
          <span className="text-xs text-danger text-left font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
