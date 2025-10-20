import IconButton from "../common/btn/IconButton";
import TaskButton from "../common/btn/TaskButton";
import Input from "../common/Input";

function Tasks() {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl mb-4 text-center">Tasks</h2>
      <div className="flex mb-4">
        <Input placeholder="Add new task" />
      </div>

      <ul className="space-y-2">
        <li
          className="
          shadow-2xl 
          border-t 
          border-b 
          border-white/10 
          px-4 
          py-3 
          rounded 
          flex 
          justify-between"
        >
          <div className="flex items-center">
            <TaskButton />
            <span>Task</span>
          </div>
          <IconButton
            icon={<i className="bi bi-x-lg cursor-pointer" />}
          ></IconButton>
        </li>
      </ul>
    </div>
  );
}

export default Tasks;
