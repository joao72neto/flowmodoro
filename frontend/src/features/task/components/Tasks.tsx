import IconButton from "../../home/components/buttons/IconButton";
import TaskButton from "../../home/components/buttons/TaskButton";
import Input from "../../../shared/components/Input";
import clsx from "clsx";
import { useTaskContext } from "../contexts/TaskContext";
import useTasksComponent from "../hooks/useTasksComponent";

import { FaTrash } from "react-icons/fa";
import { PiEmpty } from "react-icons/pi";

function Tasks() {
  const { handleAddTask, newTask, setNewTask, tasks, handleCompleteTask } =
    useTaskContext();
  const { handleDeleteTask } = useTasksComponent();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <>
      <div className="w-full max-w-xl flex flex-col h-screen">
        <h2 className="text-2xl mb-4 text-center">Tarefas</h2>
        <div className="flex mb-4">
          <Input
            placeholder="Adicionar tarefa"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex flex-col flex-1 min-h-0 overflow-auto mb-15 scrollbar-hidden">
          {tasks.length === 0 && (
            <div className="flex flex-col gap-3 justify-center items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <PiEmpty size={30} />
                <h2 className="text-xl mb-4 text-center m-0!">
                  Nenhuma tarefa cadastrada
                </h2>
              </div>
              <p className="text-neutral-40 max-w-[280px] text-center">
                Digite e pressione enter para adicionar uma nova tarefa.
              </p>
            </div>
          )}

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
                    <span className="line-clamp-1 break-all">{task.name}</span>
                  </div>
                  <IconButton
                    icon={
                      <FaTrash size={18} className="transition duration-200" />
                    }
                    onClick={() => handleDeleteTask(task.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Tasks;
