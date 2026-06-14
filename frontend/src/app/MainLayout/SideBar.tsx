import clsx from "clsx";
import IconButton from "../../shared/components/buttons/IconButton";

import { PiCaretRightBold } from "react-icons/pi";
import ThemeToggle from "../../shared/components/ThemeToggle";

import Projects from "../../features/projects/components/Projects/Projects";

const SideBar = ({
  onClick,
  title,
}: {
  onClick?: () => void;
  title?: string;
}) => {
  return (
    <div className="border-l bg-neutral-100 border-l-border h-screen shadow-2xl flex flex-col">
      <div className="flex justify-between items-center px-3 py-6 bg-neutral-80 border-b border-border">
        <IconButton
          icon={
            <PiCaretRightBold
              size={25}
              className={clsx("transition duration-200 hover:translate-x-1")}
            />
          }
          onClick={onClick}
        />
        {title && (
          <h1 className="text-xl font-bold text-neutral-20">{title}</h1>
        )}
        <ThemeToggle />
      </div>
      <div className="flex-1 min-h-0">
        <Projects />
      </div>
    </div>
  );
};

export default SideBar;
