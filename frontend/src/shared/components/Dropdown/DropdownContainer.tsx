import clsx from "clsx";

interface DropdownContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

const DropdownContainer = ({
  children,
  isOpen,
  className,
}: DropdownContainerProps) => {
  return (
    <div
      className={clsx(
        "overflow-hidden absolute right-0 mt-2 w-48 origin-top-right z-50",
        "bg-neutral-80 border border-border rounded-xl shadow-xl",
        "transition-all duration-200 ease-out",
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
