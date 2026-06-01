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
          "font-bold text-neutral-20 border-b p-4 border-border",
          "transition-colors",
        )}
      >
        <div className="group flex items-center gap-3">
          <FaChevronDown
            className={clsx(
              "transition-transform duration-300 text-neutral-40 group-hover:text-neutral-20",
              isOpen && "rotate-180",
            )}
          />
          <span className="uppercase text-neutral-40 tracking-wider group-hover:text-neutral-20">
            {groupName}
          </span>
        </div>
        <span className="text-neutral-40 group-hover:text-neutral-20">
          {totalFocus}
        </span>
      </div>

      <AnimatedCollapse show={isOpen}>
        <Stack gap={4}>{children}</Stack>
      </AnimatedCollapse>
    </Stack>
  );
};

export default DailySessions;
