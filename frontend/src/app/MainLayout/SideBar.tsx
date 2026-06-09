import clsx from "clsx";
import IconButton from "../../shared/components/buttons/IconButton";
import Stack from "../../shared/components/Stack";

import { PiCaretRightBold } from "react-icons/pi";
import ThemeToggle from "../../shared/components/ThemeToggle";
import Tasks from "../../features/tasks/components/Tasks/Tasks";

function SideBar({ onClick }: { onClick?: () => void }) {
  return (
    <div className="border-l bg-neutral-100 border-l-border h-screen shadow-2xl flex flex-col">
      <div className="flex justify-between items-center mb-4 p-3">
        <IconButton
          icon={
            <PiCaretRightBold
              size={25}
              className={clsx("transition duration-200 hover:translate-x-1")}
            />
          }
          onClick={onClick}
        />
        <ThemeToggle />
      </div>
      <Stack className="flex-1 overflow-hidden">
        <Tasks />
      </Stack>
    </div>
  );
}

export default SideBar;
