import { useState } from "react";
import tasksService from "../services/tasks.service";
import type { TaskModel } from "../types/tasks.types";

const useTask = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);

  const createTask = async (data: TaskModel) => {
    setLoading(true);

    try {
      await tasksService.createTask(data);
      return true;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await tasksService.fetchTasks();
      const data: TaskModel[] = res.data;
      setTasks(data);
      return data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { loading, tasks, createTask, fetchTasks };
};

export default useTask;
