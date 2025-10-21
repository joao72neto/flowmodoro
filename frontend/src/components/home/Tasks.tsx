import { useState } from "react";
import IconButton from "../common/btn/IconButton";
import TaskButton from "../common/btn/TaskButton";
import Input from "../common/Input";

function Tasks() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    setTasks([newTask, ...tasks]);
    setNewTask("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl mb-4 text-center">Tasks</h2>
      <div className="flex mb-4">
        <Input
          placeholder="Add new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {tasks.length > 0 && (
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="
              shadow-xl 
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
                <span>{task}</span>
              </div>
              <IconButton
                icon={<i className="bi bi-x-lg" />}
                onClick={() => handleRemoveTask(index)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;
