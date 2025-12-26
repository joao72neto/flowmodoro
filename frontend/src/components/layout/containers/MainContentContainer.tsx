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
        "flex flex-col items-center justify-center min-h-screen p-6 transition-all duration-300",
        isOpen ? "w-2/3" : "w-full"
      )}
    >
      {children}
    </div>
  );
};

export default MainContentContainer;
