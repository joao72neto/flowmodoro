import clsx from "clsx";
import IconButton from "../../features/home/components/buttons/IconButton";
import Tasks from "../../features/task/components/Tasks";
import Stack from "../../shared/components/Stack";

import { PiCaretRight } from "react-icons/pi";

function SideBar({ onClick }: { onClick?: () => void }) {
  return (
    <div className="border-l bg-[#222] border-l-white/10 h-screen p-3 shadow-2xl">
      <IconButton
        icon={
          <PiCaretRight
            size={30}
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
