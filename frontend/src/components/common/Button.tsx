import clsx from "clsx";

const baseStyle = clsx(
  "px-5",
  "py-2",
  "rounded-xl",
  "cursor-pointer",
  "font-semibold",
  "text-white",
  "border border-white/20",
  "transition-all",
  "duration-200",
  "ease-in-out",
  "hover:scale-110",
  "hover:brightness-120",
);

const variants = {
  primary: clsx(baseStyle, "bg-primary"),
  secondary: clsx(baseStyle, "bg-secondary"),
  danger: clsx(baseStyle, "bg-danger "),
  success: clsx(baseStyle, "bg-success"),
};

function Button({
  icon,
  variant,
  children,
  onClick,
  className,
}: {
  icon?: React.ReactNode;
  variant?: "secondary" | "danger" | "primary" | "success";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`${variants[variant || "primary"]} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
