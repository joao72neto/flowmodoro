import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useTasks from "./hooks/useTasks";
import type { TaskResponse } from "./task.types";
import useActiveTask from "./hooks/useActiveTask";
import { useModal } from "../../shared/modal.context";

interface TaskContextType {
  handleAddTask: () => Promise<void>;
  newTask: string;
  setNewTask: (task: string) => void;
  handleRemoveTask: (id: number) => Promise<void>;
  handleCompleteTask: (index: number, checked: boolean) => Promise<void>;
  handleUpdateTask: (id: number, name: string) => Promise<void>;
  setManualActiveTaskId: (id: number | null) => void;
  tasks: TaskResponse[];
  selectedTask: string;
  setSelectedTask: (task: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  undoneTasks: TaskResponse[];
  wasTaskDeleted: boolean;
  activeTask: TaskResponse | undefined;
  isAddingTask: boolean;
  processingTaskId: number | null;
  isLoadingTasks: boolean;
}

export const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [newTask, setNewTask] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [processingTaskId, setProcessingTaskId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<string>("Select a task...");
  const [manualActiveTaskId, setManualActiveTaskId] = useState<number | null>(
    null,
  );

  const {
    createTask,
    fetchTasks,
    deleteTask,
    updateTaskStatus,
    updateTask,
    tasks,
    loading: isLoadingTasks,
  } = useTasks();

  const { showError, hideModal } = useModal();

  const undoneTasks = useMemo(
    () => tasks.filter((task) => !task.checked),
    [tasks],
  );

  const taskToProcess = useMemo(() => {
    if (manualActiveTaskId) {
      const task = undoneTasks.find((t) => t.id === manualActiveTaskId);
      if (task) return [task];
    }
    return undoneTasks;
  }, [undoneTasks, manualActiveTaskId]);

  const { activeTask } = useActiveTask(taskToProcess);
  const [wasTaskDeleted, setWasTaskDeleted] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (activeTask) {
      setSelectedTask(activeTask.name);
    } else {
      setSelectedTask("Crie nova tarefa");
    }
  }, [activeTask]);

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;
    setIsAddingTask(true);
    try {
      await createTask({ name: newTask, checked: false });
      await fetchTasks();
      setNewTask("");
      setSelectedTask(newTask);
    } catch (error: any) {
      if (error instanceof Error)
        showError({
          title: "Erro ao criar tarefa",
          message: error.message,
          action: hideModal,
        });
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleRemoveTask = async (id: number) => {
    setWasTaskDeleted(false);
    setProcessingTaskId(id);
    try {
      await deleteTask(id);
      await fetchTasks();
      setWasTaskDeleted(true);
    } catch (error: any) {
      if (error instanceof Error)
        showError({
          title: "Erro ao deletar tarefa",
          message: error.message,
          action: hideModal,
        });
    } finally {
      setProcessingTaskId(null);
    }
  };

  const handleUpdateTask = async (id: number, name: string) => {
    setProcessingTaskId(id);
    try {
      await updateTask(id, { name });
      await fetchTasks();
    } catch (error: any) {
      if (error instanceof Error)
        showError({
          title: "Erro ao atualizar tarefa",
          message: error.message,
          action: hideModal,
        });
    } finally {
      setProcessingTaskId(null);
    }
  };

  const handleCompleteTask = async (id: number, checked: boolean) => {
    setProcessingTaskId(id);
    try {
      await updateTaskStatus(id, { checked: !checked });
      await fetchTasks();
    } catch (error: any) {
      if (error instanceof Error)
        showError({
          title: "Erro ao atualizar tarefa",
          message: error.message,
          action: hideModal,
        });
    } finally {
      setProcessingTaskId(null);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        handleAddTask,
        newTask,
        setNewTask,
        handleCompleteTask,
        handleRemoveTask,
        tasks,
        selectedTask,
        setSelectedTask,
        isSidebarOpen,
        setIsSidebarOpen,
        undoneTasks,
        wasTaskDeleted,
        activeTask,
        handleUpdateTask,
        setManualActiveTaskId,
        isAddingTask,
        processingTaskId,
        isLoadingTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used within a TaskProvider");

  return context;
};
