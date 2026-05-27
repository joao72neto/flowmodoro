import clsx from "clsx";
import type { VariantType } from "../globals.types";

const baseStyle = clsx(
  "px-5",
  "py-2",
  "rounded-lg",
  "font-semibold",
  "text-white",
  "shadow",
  "transition-all",
  "duration-200",
  "ease-in-out",
  "cursor-pointer",
  "hover:scale-105",
  "hover:brightness-120",
  "active:scale-95",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "disabled:hover:scale-100",
  "disabled:hover:brightness-100",
  "disabled:active:scale-100",
);

const variants = {
  primary: clsx(baseStyle, "bg-primary"),
  secondary: clsx(baseStyle, "bg-secondary"),
  danger: clsx(baseStyle, "bg-danger"),
  danger2: clsx(baseStyle, "bg-danger-2"),
  success: clsx(baseStyle, "bg-success"),
  success2: clsx(baseStyle, "bg-success-2"),
};

function Button({
  icon,
  variant,
  children,
  onClick,
  className,
  disabled,
  title,
  loading,
}: {
  icon?: React.ReactNode;
  variant?: VariantType;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  title?: string;
  loading?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
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
