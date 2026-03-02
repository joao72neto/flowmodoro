import IconButton from "../../features/home/components/buttons/IconButton";
import Tasks from "../../features/home/components/tasks/Tasks";
import Stack from "../common/Stack";

function SideBar({ onClick }: { onClick?: () => void }) {
  return (
    <div className="border-l bg-[#222] border-l-white/10 h-screen p-3 shadow-2xl">
      <IconButton
        icon={<i className="bi bi-caret-right" />}
        onClick={onClick}
      />
      <Stack>
        <Tasks />
      </Stack>
    </div>
  );
}

export default SideBar;
