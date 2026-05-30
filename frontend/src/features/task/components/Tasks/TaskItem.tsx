import { useState } from "react";
import clsx from "clsx";
import {
  FaTrash,
  FaCheck,
  FaPlay,
  FaStop,
  FaForwardStep,
} from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import IconButton from "../../../home/components/buttons/IconButton";
import TaskButton from "../../../home/components/buttons/TaskButton";
import { useTaskContext } from "../../task.context";
import { useTimerContext } from "../../../home/timer.context";
import type { TaskResponse } from "../../task.types";
import { useModal } from "../../../../shared/modal.context";

interface TaskItemProps {
  task: TaskResponse;
}

function TaskItem({ task }: TaskItemProps) {
  const {
    handleCompleteTask,
    handleUpdateTask,
    handleRemoveTask,
    activeTask,
    setManualActiveTaskId,
    processingTaskId,
  } = useTaskContext();
  const { startFocus, stopFocus, startBreak, skipBreak, mode } =
    useTimerContext();

  const { showWarning, hideModal } = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(task.name);

  const isProcessing = processingTaskId === task.id;

  const isTaskRunning = mode === "focus" && activeTask?.id === task.id;
  const isTaskBreaking = mode === "break" && activeTask?.id === task.id;
  const isTaskStopped = mode === "stopped" && activeTask?.id === task.id;

  const saveEditing = async () => {
    if (editingName.trim() !== "" && editingName !== task.name) {
      await handleUpdateTask(task.id, editingName);
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveEditing();
    } else if (e.key === "Escape") {
      setEditingName(task.name);
      setIsEditing(false);
    }
  };

  const handleDeleteTask = (id: number) => {
    showWarning({
      title: "Deletar tarefa",
      message: "Tem certeza que deseja deletar essa tarefa?",
      action: () => {
        handleRemoveTask(id);
        hideModal();
      },
    });
  };

  const getTimerIcon = () => {
    if (isTaskRunning) {
      return <FaStop title="Parar timer" size={18} className="text-danger-2" />;
    }
    if (isTaskStopped) {
      return (
        <FaPlay title="Iniciar pausa" size={18} className="text-success" />
      );
    }
    if (isTaskBreaking) {
      return (
        <FaForwardStep
          title="Pular pausa"
          size={18}
          className="text-success-2"
        />
      );
    }
    return <FaPlay title="Iniciar timer" size={18} className="text-danger" />;
  };

  const handleTimerAction = () => {
    if (isTaskRunning) {
      stopFocus();
    } else if (isTaskStopped) {
      startBreak();
    } else if (isTaskBreaking) {
      skipBreak();
    } else {
      setManualActiveTaskId(task.id);
      startFocus();
    }
  };

  return (
    <li
      className={clsx(
        "shadow-xl border rounded-2xl border-white/5 px-4 py-4 flex justify-between items-center",
        "transition-all duration-300 bg-neutral-80/60 backdrop-blur-md",
        {
          "hover:bg-neutral-60/80 cursor-pointer": !task.checked && !isProcessing,
          "line-through text-neutral-500": task.checked,
          "opacity-50 pointer-events-none": isProcessing,
        },
      )}
      onClick={() =>
        !isProcessing &&
        task.checked &&
        handleCompleteTask(task.id, task.checked)
      }
    >
      <div
        className={clsx(
          "flex items-center flex-1 mr-4",
          task.checked && !isProcessing && "cursor-pointer",
        )}
      >
        {mode !== "focus" && (
          <TaskButton
            taskCompleted={task.checked}
            onClick={() =>
              !isProcessing && handleCompleteTask(task.id, task.checked)
            }
          />
        )}

        {isEditing ? (
          <input
            autoFocus
            className="bg-transparent outline-none w-full ml-2"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={saveEditing}
            disabled={isProcessing}
          />
        ) : (
          <span className="line-clamp-1 break-all ml-2">{task.name}</span>
        )}
      </div>

      {!task.checked && (
        <div className="flex gap-5">
          <IconButton
            icon={getTimerIcon()}
            onClick={handleTimerAction}
            disabled={isProcessing}
          />
          {mode !== "focus" && (
            <>
              {isEditing ? (
                <IconButton
                  title="Salvar edição"
                  icon={<FaCheck size={22} className="text-success" />}
                  onClick={saveEditing}
                  disabled={isProcessing}
                />
              ) : (
                <IconButton
                  title="Editar tarefa"
                  icon={<MdModeEdit size={22} />}
                  onClick={() => setIsEditing(true)}
                  disabled={isProcessing}
                />
              )}
              <IconButton
                title="Deletar tarefa"
                icon={<FaTrash size={18} className="transition duration-200" />}
                onClick={() => handleDeleteTask(task.id)}
                disabled={isProcessing}
              />
            </>
          )}
        </div>
      )}
    </li>
  );
}

export default TaskItem;
