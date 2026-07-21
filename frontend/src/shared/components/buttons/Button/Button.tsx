import clsx from "clsx";
import type { VariantType } from "../../../types/global.types";
import { variants } from "./buttonVariants";

import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  variant?: VariantType;
  loading?: boolean;
}

function Button({
  icon,
  variant,
  children,
  className,
  disabled,
  loading,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(variants[variant || "primary"], className)}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : (
          icon
        )}
        {children}
      </div>
    </button>
  );
}

export default Button;
