import { useState } from "react";
import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { FaChevronDown } from "react-icons/fa6";
import { useTheme } from "../../../../shared/contexts/theme/theme.context";
import { isNative } from "../../../../consts/platform";

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
  const { theme } = useTheme();

  return (
    <div className="w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex justify-between items-center gap-2 w-full cursor-pointer group",
          "font-bold text-neutral-20 border-b p-4 border-border",
          "transition-colors mb-4",
        )}
      >
        <div className="group flex items-center gap-3">
          <FaChevronDown
            className={clsx(
              "transition-transform duration-300 text-neutral-20 group-hover:text-neutral-10",
              isOpen && "rotate-180",
            )}
          />
          <span className="uppercase text-neutral-20 tracking-wider group-hover:text-neutral-10">
            {groupName}
          </span>
        </div>
        <span className="text-neutral-20 group-hover:text-neutral-10">
          {totalFocus}
        </span>
      </div>

      <AnimatedCollapse enableHeavyAnimations={!isNative} show={isOpen}>
        <Stack gap={2} className={clsx(theme === "light" && "pb-4")}>
          {children}
        </Stack>
      </AnimatedCollapse>
    </div>
  );
};

export default DailySessions;
