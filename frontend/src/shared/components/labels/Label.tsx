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
  const bgColor =
    variant === "primary"
      ? "bg-primary/10 hover:bg-primary/15"
      : "bg-secondary/10 hover:bg-secondary/15";
  const textColor = variant === "primary" ? "text-primary" : "text-secondary";
  const borderColor =
    variant === "primary"
      ? "border-primary/25 hover:border-primary/45"
      : "border-secondary/25 hover:border-secondary/45";

  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 shrink-0",
        "px-2.5 py-0.5 sm:py-1 rounded-lg border",
        "transition-[scale] duration-200 ease-out hover:scale-[1.02] cursor-default select-none",
        bgColor,
        textColor,
        borderColor,
        className,
      )}
    >
      {icon && (
        <span className="text-xs sm:text-sm shrink-0 opacity-80">{icon}</span>
      )}
      <span className="truncate text-[10px] sm:text-xs font-semibold tracking-wide flex-1 text-left">
        {children}
      </span>
    </div>
  );
};

export default Label;
