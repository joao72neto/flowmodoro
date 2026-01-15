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
        "flex flex-wrap justify-center min-h-screen p-6 transition-all duration-300",
        "gap-x-50",
        isOpen ? "w-2/3" : "w-full"
      )}
    >
      {children}
    </div>
  );
};

export default MainContentContainer;
