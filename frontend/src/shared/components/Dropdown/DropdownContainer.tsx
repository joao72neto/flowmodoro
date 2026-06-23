import clsx from "clsx";

interface DropdownContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}

const DropdownContainer = ({
  children,
  isOpen,
  className,
  ref,
  style,
}: DropdownContainerProps) => {
  const isFloating = !!style;

  return (
    <div
      ref={ref}
      style={style}
      className={clsx(
        "overflow-hidden z-50",
        "bg-neutral-80 border border-border rounded-xl shadow-xl",
        "transition-all duration-200 ease-out",
        !isFloating && "absolute right-0 mt-2 w-48 origin-top-right",
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
