import { useState } from "react";
import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { FaChevronDown } from "react-icons/fa6";

const DailySessions = ({
  children,
  groupName,
  totalFocus,
}: {
  children: React.ReactNode;
  totalFocus: string | undefined;
  groupName: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Stack className="w-full" gap={4}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex justify-between items-center gap-2 w-full cursor-pointer group",
          "font-bold text-neutral-20 border-b p-4 border-white/10",
          "transition-colors",
        )}
      >
        <div className="flex items-center gap-3">
          <FaChevronDown
            className={clsx(
              "transition-transform duration-300 text-neutral-400 group-hover:text-white",
              isOpen && "rotate-180",
            )}
          />
          <span className="uppercase text-neutral-300 tracking-wider">
            {groupName}
          </span>
        </div>
        <span className="text-neutral-300">{totalFocus}</span>
      </div>

      <AnimatedCollapse show={isOpen}>
        <Stack gap={4}>{children}</Stack>
      </AnimatedCollapse>
    </Stack>
  );
};

export default DailySessions;
