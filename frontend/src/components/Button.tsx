import clsx from "clsx";

const baseStyle = clsx(
  "px-5",
  "py-2",
  "rounded-2xl",
  "cursor-pointer",
  "font-semibold",
  "text-white",
  "border-white/10",
  "hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]",
  "transition"
);

const variants = {
  primary: clsx(baseStyle, "bg-primary"),
  secondary: clsx(baseStyle, "bg-secondary"),
  danger: clsx(baseStyle, "bg-danger"),
};

function Button({
  icon,
  variant,
  children,
  onClick,
}: {
  icon?: React.ReactNode;
  variant?: "secondary" | "danger" | "primary";
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className={variants[variant || "primary"]}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
