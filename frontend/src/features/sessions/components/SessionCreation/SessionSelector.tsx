import clsx from "clsx";

const SessionSelector = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 border border-border p-2 rounded-lg hover:cursor-pointer",
        "bg-neutral-80 max-w-30 line-clamp-1",
      )}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

export default SessionSelector;
