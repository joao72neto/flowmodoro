import clsx from "clsx";
import type { VariantType } from "../../globals.types";
import { variants } from "./Button";

interface ExpandableButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: VariantType;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  title?: string;
  loading?: boolean;
}

function ExpandableButton({
  icon,
  variant,
  children,
  onClick,
  className,
  disabled,
  title,
  loading,
}: ExpandableButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        variants[variant || "primary"],
        "group flex items-center justify-center gap-0 hover:gap-2",
        "overflow-hidden whitespace-nowrap px-4!",
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
          "group-hover:max-w-xs group-hover:opacity-100",
          loading && "hidden",
        )}
      >
        {children}
      </span>
    </button>
  );
}

export default ExpandableButton;
