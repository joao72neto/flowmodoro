import clsx from "clsx";

const MainContentContainer = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-center min-h-screen p-15 transition-all duration-300",
        "gap-15",
        isOpen ? "w-2/3" : "w-full",
      )}
    >
      {children}
    </div>
  );
};

export default MainContentContainer;
