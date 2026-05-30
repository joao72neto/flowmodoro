import clsx from "clsx";
import IconButton from "../../features/home/components/buttons/IconButton";
import Tasks from "../../features/task/components/Tasks/Tasks";
import Stack from "../../shared/components/Stack";

import { PiCaretRightBold } from "react-icons/pi";

function SideBar({ onClick }: { onClick?: () => void }) {
  return (
    <div className="border-l bg-neutral-100 border-l-white/5 h-screen p-3 shadow-2xl">
      <IconButton
        icon={
          <PiCaretRightBold
            size={25}
            className={clsx("transition duration-200 hover:translate-x-1")}
          />
        }
        onClick={onClick}
      />
      <Stack>
        <Tasks />
      </Stack>
    </div>
  );
}

export default SideBar;
