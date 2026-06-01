import clsx from "clsx";

const sizes = {
  sm: "max-w-[100px]",
  md: "max-w-[200px]",
  lg: "max-w-[300px]",
};

const InfoWrapper = ({
  children,
  className,
  size = "sm",
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
}) => {
  return (
    <div
      className={clsx(
        "p-2 border border-border rounded-xl text-center w-full",
        "bg-neutral-80/40 backdrop-blur-sm text-neutral-40 text-sm sm:text-base",
        className,
        sizes[size],
      )}
    >
      {children}
    </div>
  );
};

export default InfoWrapper;
