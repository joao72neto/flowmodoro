import clsx from "clsx";
import type { VariantType } from "../../global.types";
import { variants } from "./Button/buttonVariants";

import { type ButtonHTMLAttributes } from "react";

interface ExpandableButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: VariantType;
  loading?: boolean;
  disableExpansion?: boolean;
}

function ExpandableButton({
  icon,
  variant,
  children,
  className,
  disabled,
  loading,
  disableExpansion = false,
  ...props
}: ExpandableButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        variants[variant || "primary"],
        "group flex items-center justify-center gap-0",
        "overflow-hidden whitespace-nowrap px-4!",
        !disableExpansion && "hover:gap-2",
        className,
      )}
    >
      <span className="shrink-0">
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-border border-t-transparent" />
        ) : (
          icon
        )}
      </span>
      <span
        className={clsx(
          "max-w-0 opacity-0 overflow-hidden transition-all duration-300 ease-in-out",
          !disableExpansion && "group-hover:max-w-xs group-hover:opacity-100",
          loading && "hidden",
        )}
      >
        {children}
      </span>
    </button>
  );
}

export default ExpandableButton;
