import IconButton from "../../home/components/buttons/IconButton";
import TaskButton from "../../home/components/buttons/TaskButton";
import Input from "../../../shared/components/Input";
import clsx from "clsx";
import { useTaskContext } from "../contexts/TaskContext";
import useTasksComponent from "../hooks/useTasksComponent";
import { useState, useMemo } from "react";

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
  const [activeTab, setActiveTab] = useState<"todo" | "done">("todo");

  const { todoCount, doneCount } = useMemo(() => {
    return {
      todoCount: tasks.filter((t) => !t.checked).length,
      doneCount: tasks.filter((t) => t.checked).length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      activeTab === "todo" ? !task.checked : task.checked,
    );
  }, [tasks, activeTab]);

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

        <div className="flex border-b border-white/10 mb-4">
          <button
            onClick={() => setActiveTab("todo")}
            className={clsx(
              "flex-1 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-2",
              activeTab === "todo"
                ? "border-danger text-danger"
                : "border-transparent text-neutral-400 hover:text-white",
            )}
          >
            A fazer
            <span
              className={clsx(
                "px-2 py-1 flex items-center justify-center rounded-full text-[10px] font-bold",
                activeTab === "todo"
                  ? "bg-danger text-white"
                  : "bg-white/10 text-neutral-400",
              )}
            >
              {todoCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("done")}
            className={clsx(
              "flex-1 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-2",
              activeTab === "done"
                ? "border-success text-success"
                : "border-transparent text-neutral-400 hover:text-white",
            )}
          >
            Concluído
            <span
              className={clsx(
                "px-2 py-1 flex items-center justify-center rounded-full text-[10px] font-bold",
                activeTab === "done"
                  ? "bg-success text-neutral-100"
                  : "bg-white/10 text-neutral-400",
              )}
            >
              {doneCount}
            </span>
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 overflow-auto mb-15 scrollbar-hidden">
          {filteredTasks.length === 0 && (
            <div className="flex flex-col gap-3 justify-center items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <PiEmpty size={30} />
                <h2 className="text-xl mb-4 text-center m-0!">
                  {activeTab === "todo"
                    ? "Nada para fazer"
                    : "Nenhuma tarefa concluída"}
                </h2>
              </div>
              <p className="text-neutral-40 max-w-[280px] text-center">
                {activeTab === "todo"
                  ? "Aproveite seu tempo livre ou adicione uma nova tarefa."
                  : "As tarefas que você terminar aparecerão aqui."}
              </p>
            </div>
          )}

          {filteredTasks.length > 0 && (
            <ul className="space-y-2">
              {filteredTasks.map((task) => (
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
                        className="bg-transparent outline-none w-full ml-2 border-b border-white/20"
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
