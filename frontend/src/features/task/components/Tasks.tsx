import IconButton from "../../home/components/buttons/IconButton";
import TaskButton from "../../home/components/buttons/TaskButton";
import Input from "../../../shared/components/Input";
import clsx from "clsx";
import { useTaskContext } from "../contexts/TaskContext";
import useTasksComponent from "../hooks/useTasksComponent";
import { useState } from "react";

import { FaTrash, FaCheck } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { PiEmpty } from "react-icons/pi";

function Tasks() {
  const {
    handleAddTask,
    newTask,
    setNewTask,
    tasks,
    handleCompleteTask,
    handleUpdateTask,
  } = useTaskContext();
  const { handleDeleteTask } = useTasksComponent();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const startEditing = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEditing = async () => {
    if (editingId && editingName.trim() !== "") {
      await handleUpdateTask(editingId, editingName);
      setEditingId(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveEditing();
    } else if (e.key === "Escape") {
      setEditingId(null);
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
                    "shadow-xl border-t border-b border-white/10 px-4 py-3 rounded flex justify-between items-center",
                    {
                      "line-through text-neutral-500": task.checked,
                    },
                  )}
                >
                  <div className="flex items-center flex-1 mr-4">
                    <TaskButton
                      onClick={() => handleCompleteTask(task.id, task.checked)}
                      taskCompleted={task.checked}
                    />
                    {editingId === task.id ? (
                      <input
                        autoFocus
                        className="bg-transparent outline-none w-full ml-2"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={saveEditing}
                      />
                    ) : (
                      <span className="line-clamp-1 break-all ml-2">
                        {task.name}
                      </span>
                    )}
                  </div>

                  {!task.checked && (
                    <div className="flex gap-2">
                      {editingId === task.id ? (
                        <IconButton
                          icon={<FaCheck size={18} className="text-success" />}
                          onClick={saveEditing}
                        />
                      ) : (
                        <IconButton
                          icon={<MdModeEdit size={18} />}
                          onClick={() => startEditing(task.id, task.name)}
                        />
                      )}
                      <IconButton
                        icon={
                          <FaTrash
                            size={16}
                            className="transition duration-200"
                          />
                        }
                        onClick={() => handleDeleteTask(task.id)}
                      />
                    </div>
                  )}
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
