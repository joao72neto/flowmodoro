import IconButton from "../common/btn/IconButton";
import Tasks from "./Tasks";

function SideBar() {
  return (
    <div className="border-l border-l-white/10 h-screen p-3 shadow-2xl">
      <IconButton
        icon={<i className="bi bi-caret-right-fill text-xl cursor-pointer" />}
      />
      <div className="flex flex-col items-center">
        <Tasks />
      </div>
    </div>
  );
}

export default SideBar;
