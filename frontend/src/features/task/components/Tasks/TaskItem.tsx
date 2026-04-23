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
  } = useTaskContext();
  const { startFocus, stopFocus, startBreak, skipBreak, mode } =
    useTimerContext();

  const { showWarning, hideModal } = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(task.name);

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
      return <FaStop size={14} className="text-danger-2" />;
    }
    if (isTaskStopped) {
      return <FaPlay size={14} className="text-success" />;
    }
    if (isTaskBreaking) {
      return <FaForwardStep size={14} className="text-success-2" />;
    }
    return <FaPlay size={14} className="text-danger" />;
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
        {isEditing ? (
          <input
            autoFocus
            className="bg-transparent outline-none w-full ml-2"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={saveEditing}
          />
        ) : (
          <span className="line-clamp-1 break-all ml-2">{task.name}</span>
        )}
      </div>

      {!task.checked && (
        <div className="flex gap-2">
          <IconButton icon={getTimerIcon()} onClick={handleTimerAction} />
          {isEditing ? (
            <IconButton
              icon={<FaCheck size={18} className="text-success" />}
              onClick={saveEditing}
            />
          ) : (
            <IconButton
              icon={<MdModeEdit size={18} />}
              onClick={() => setIsEditing(true)}
            />
          )}
          <IconButton
            icon={<FaTrash size={16} className="transition duration-200" />}
            onClick={() => handleDeleteTask(task.id)}
          />
        </div>
      )}
    </li>
  );
}

export default TaskItem;
