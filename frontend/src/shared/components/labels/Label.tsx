import clsx from "clsx";

const Label = ({
  children,
  icon,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) => {
  const bgColor = variant === "primary" ? "bg-primary/10" : "bg-secondary/10";
  const textColor = variant === "primary" ? "text-primary" : "text-secondary";
  const borderColor =
    variant === "primary" ? "border-primary/20" : "border-secondary/20";

  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 max-w-[110px]",
        "px-2.5 py-1 rounded-full border",
        bgColor,
        textColor,
        borderColor,
        className,
      )}
    >
      {icon && <span className="text-xs sm:text-sm shrink-0">{icon}</span>}
      <span className="truncate text-[10px] sm:text-xs font-medium max-w-28">
        {children}
      </span>
    </div>
  );
};

export default Label;
