import clsx from "clsx";

const FormContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx("flex flex-col justify-center gap-4 flex-1", className)}
    >
      {children}
    </div>
  );
};

export default FormContainer;
