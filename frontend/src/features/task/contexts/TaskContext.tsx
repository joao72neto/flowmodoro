import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useTasks from "../hooks/useTasks";
import type { TaskModel } from "../types/tasks.types";
import useActiveTask from "../hooks/useActiveTask";
import { useModal } from "../../../shared/contexts/ModalContext";

interface TaskContextType {
  handleAddTask: () => Promise<void>;
  newTask: string;
  setNewTask: (task: string) => void;
  handleRemoveTask: (id: number) => Promise<void>;
  handleCompleteTask: (index: number, checked: boolean) => Promise<void>;
  handleUpdateTask: (id: number, name: string) => Promise<void>;
  tasks: TaskModel[];
  selectedTask: string;
  setSelectedTask: (task: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  undoneTasks: TaskModel[];
  wasTaskDeleted: boolean;
  activeTask: TaskModel | undefined;
}

export const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [newTask, setNewTask] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>("Select a task...");
  const {
    createTask,
    fetchTasks,
    deleteTask,
    updateTaskStatus,
    updateTask,
    tasks,
  } = useTasks();

  const { showError } = useModal();

  const undoneTasks = useMemo(
    () => tasks.filter((task) => !task.checked),
    [tasks],
  );
  const { activeTask } = useActiveTask(undoneTasks);
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
    try {
      await createTask({ name: newTask, checked: false });
      await fetchTasks();
      setNewTask("");
      setSelectedTask(newTask);
    } catch (error: any) {
      if (error instanceof Error)
        showError("Erro ao criar tarefa", error.message, () => {});
    }
  };

  const handleRemoveTask = async (id: number) => {
    setWasTaskDeleted(false);
    try {
      await deleteTask(id);
      await fetchTasks();
      setWasTaskDeleted(true);
    } catch (error: any) {
      if (error instanceof Error)
        showError("Erro ao deletar tarefa", error.message, () => {});
    }
  };

  const handleUpdateTask = async (id: number, name: string) => {
    try {
      await updateTask(id, { name });
      await fetchTasks();
    } catch (error: any) {
      if (error instanceof Error)
        showError("Erro ao atualizar tarefa", error.message, () => {});
    }
  };

  const handleCompleteTask = async (index: number, checked: boolean) => {
    try {
      await updateTaskStatus(index, { checked: !checked });
      await fetchTasks();
    } catch (error: any) {
      if (error instanceof Error)
        showError("Erro ao atualizar tarefa", error.message, () => {});
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
