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
        "relative flex flex-col justify-center items-center px-15 py-20 ",
        "transition-all duration-300 gap-12",
        isOpen ? "w-2/3" : "w-full",
      )}
    >
      {children}
    </div>
  );
};

export default MainContentContainer;
