import clsx from "clsx";

interface DropdownContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  align?: "left" | "right" | "auto";
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const DropdownContainer = ({
  children,
  isOpen,
  align = "left",
  className,
  ref,
}: DropdownContainerProps) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "overflow-hidden z-50",
        "bg-neutral-80 border border-border rounded-xl shadow-xl",
        "transition-all duration-200 ease-out",
        "absolute mt-2 w-48 origin-top-right",
        align === "left"
          ? "left-0"
          : align === "right"
            ? "right-0"
            : "left-0! sm:left-auto! sm:right-0!",
        isOpen
          ? "opacity-100 scale-100 translate-y-0 visible"
          : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default DropdownContainer;
