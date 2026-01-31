import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useTasks from "../hooks/services/useTasks";
import type { TaskModel } from "../types/tasks.types";
import useActiveTask from "../hooks/useActiveTask";

interface TaskContextType {
  handleAddTask: () => Promise<void>;
  newTask: string;
  setNewTask: (task: string) => void;
  handleRemoveTask: (id: number) => Promise<void>;
  handleCompleteTask: (index: number, checked: boolean) => Promise<void>;
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
  const { createTask, fetchTasks, deleteTask, updateTaskStatus, tasks } =
    useTasks();

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
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleRemoveTask = async (id: number) => {
    setWasTaskDeleted(false);
    try {
      await deleteTask(id);
      await fetchTasks();
      setWasTaskDeleted(true);
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
