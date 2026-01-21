import IconButton from "../buttons/IconButton";
import TaskButton from "../buttons/TaskButton";
import Input from "../../common/Input";
import clsx from "clsx";
import { useSessionContext } from "../../../contexts/SessionContext";
function Tasks() {
  const {
    handleAddTask,
    newTask,
    setNewTask,
    tasks,
    handleCompleteTask,
    handleRemoveTask,
  } = useSessionContext();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <>
      <div className="w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center">Tasks</h2>
        <div className="flex mb-4">
          <Input
            placeholder="Enter to add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {tasks.length > 0 && (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={clsx(
                  "shadow-xl border-t border-b border-white/10 px-4 py-3 rounded flex justify-between",
                  {
                    "line-through": task.checked,
                  },
                )}
              >
                <div className="flex items-center">
                  <TaskButton
                    onClick={() => handleCompleteTask(task.id, task.checked)}
                    taskCompleted={task.checked}
                  />
                  <span>{task.name}</span>
                </div>
                <IconButton
                  icon={<i className="bi bi-x-lg" />}
                  onClick={() => handleRemoveTask(task.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Tasks;
