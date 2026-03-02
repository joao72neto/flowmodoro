import clsx from "clsx";

const SideBarContainer = ({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) => {
  return (
    <div
      className={clsx(
        "fixed top-0 right-0 lg:max-w-md w-full z-20 transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      {children}
    </div>
  );
};

export default SideBarContainer;
