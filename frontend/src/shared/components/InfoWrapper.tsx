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
        "py-2 border border-white/10 rounded-xl text-center w-full",
        "hover:bg-white/10 text-sm sm:text-base",
        className,
        sizes[size],
      )}
    >
      {children}
    </div>
  );
};

export default InfoWrapper;
