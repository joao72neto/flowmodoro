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
        "relative py-20 transition-all duration-300",
        isOpen ? "w-2/3" : "w-full",
      )}
    >
      <div className="flex flex-col gap-6 max-w-180 mx-auto w-full">
        {children}
      </div>
    </div>
  );
};

export default MainContentContainer;
