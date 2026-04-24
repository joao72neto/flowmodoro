import clsx from "clsx";

const SideBarContainer = ({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) => {
  return (
    <aside
      className={clsx(
        "fixed top-0 right-0 h-full w-full sm:max-w-md z-30 transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      {children}
    </aside>
  );
};

export default SideBarContainer;
