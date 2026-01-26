import React, { createContext, useContext, useEffect, useState } from "react";
import useTasks from "../hooks/services/useTasks";
import type { TaskModel } from "../types/tasks.types";
import { useSessionContext } from "./SessionContext";

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
}

export const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [newTask, setNewTask] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>("Select a task...");
  const { createTask, fetchTasks, deleteTask, updateTaskStatus, tasks } =
    useTasks();
  const undoneTasks = tasks.filter((task) => !task.checked);
  const { setTaskId } = useSessionContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const firstUndoneTask = undoneTasks[0];

    if (!firstUndoneTask) {
      setSelectedTask("Crie nova tarefa");
      return;
    }

    setTaskId(firstUndoneTask.id);
    setSelectedTask(firstUndoneTask.name);
  }, [undoneTasks, setTaskId]);

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
    try {
      await deleteTask(id);
      await fetchTasks();
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
