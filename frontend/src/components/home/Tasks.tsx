import { useEffect, useState } from "react";
import IconButton from "./buttons/IconButton";
import TaskButton from "./buttons/TaskButton";
import Input from "../common/Input";
import useTasks from "../../hooks/useTasks";
import clsx from "clsx";

function Tasks() {
  const [newTask, setNewTask] = useState("");
  const { createTask, fetchTasks, tasks, deleteTask, updateTaskStatus } =
    useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    try {
      await createTask({ name: newTask, checked: false });
      await fetchTasks();
      setNewTask("");
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const handleRemoveTask = async (id: number) => {
    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (e: any) {
      console.log(e);
    }
  };
  const handleCompleteTask = async (index: number, checked: boolean) => {
    try {
      await updateTaskStatus(index, { checked: !checked });
      await fetchTasks();
    } catch (e: any) {
      console.log(e);
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
                  }
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
