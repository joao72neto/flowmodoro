import React, { createContext, useEffect, useState } from "react";
import useTasks from "../hooks/useTasks";
import type { TaskModel } from "../types/tasks.types";

interface SessionContextType {
  handleAddTask: () => Promise<void>;
  newTask: string;
  setNewTask: (task: string) => void;
  handleRemoveTask: (id: number) => Promise<void>;
  handleCompleteTask: (index: number, checked: boolean) => Promise<void>;
  tasks: TaskModel[];
  selectedTask: string;
  setSelectedTask: (task: string) => void;
}

export const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [newTask, setNewTask] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<string>("Select a task...");
  const { createTask, fetchTasks, deleteTask, updateTaskStatus, tasks } =
    useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
    <SessionContext.Provider
      value={{
        handleAddTask,
        newTask,
        setNewTask,
        handleCompleteTask,
        handleRemoveTask,
        tasks,
        selectedTask,
        setSelectedTask,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
