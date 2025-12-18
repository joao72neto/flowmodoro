import { useState } from "react";
import IconButton from "./buttons/IconButton";
import TaskButton from "./buttons/TaskButton";
import Input from "../../components/Input";

function Tasks() {
  type Task = {
    text: string;
    completed: boolean;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    setTasks([{ text: newTask, completed: false }, ...tasks]);
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

  const handleCompleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    const selectedTask = { ...updatedTasks[index] };

    selectedTask.completed = !selectedTask.completed;
    updatedTasks.splice(index, 1);

    const newTasks = [...updatedTasks, selectedTask];

    setTasks([...newTasks]);
  };

  return (
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
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`
              shadow-xl 
              border-t 
              border-b 
              border-white/10 
              px-4 
              py-3 
              rounded 
              flex
              justify-between
              ${task.completed ? "line-through" : ""}
            `}
            >
              <div className="flex items-center">
                <TaskButton
                  onClick={() => handleCompleteTask(index)}
                  taskCompleted={task.completed}
                />
                <span>{task.text}</span>
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
