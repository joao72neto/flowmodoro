import IconButton from "../home/buttons/IconButton";
import Tasks from "../home/Tasks";

function SideBar({ onClick }: { onClick?: () => void }) {
  return (
    <div className="border-l bg-[#222] border-l-white/10 h-screen p-3 shadow-2xl">
      <IconButton
        icon={<i className="bi bi-caret-right" />}
        onClick={onClick}
      />
      <div className="flex flex-col items-center">
        <Tasks />
      </div>
    </div>
  );
}

export default SideBar;
