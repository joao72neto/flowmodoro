import clsx from "clsx";

const Line = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        "flex-1 border-b border-dotted border-white/10 mx-2",
        className,
      )}
    />
  );
};

export default Line;
