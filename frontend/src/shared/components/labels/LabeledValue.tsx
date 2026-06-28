import clsx from "clsx";
import type { JSX } from "react";

const LabeledValue = ({
  name,
  value,
  className,
}: {
  name: string;
  value: string | JSX.Element | undefined;
  className?: string;
}) => {
  return (
    <div className={clsx("flex items-center justify-between gap-6", className)}>
      <span
        className={clsx(
          "text-left text-neutral-20 font-medium text-sm sm:text-base line-clamp-1",
        )}
      >
        {name}
      </span>
      <span className="text-neutral-20">{value}</span>
    </div>
  );
};

export default LabeledValue;
