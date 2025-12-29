import { useCallback, useState } from "react";
import tasksService from "../services/tasks.service";
import type {
  TaskModel,
  TaskRequest,
  UpdateTaskRequest,
} from "../types/tasks.types";

const useTask = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);

  const createTask = useCallback(async (data: TaskRequest) => {
    setLoading(true);

    try {
      await tasksService.createTask(data);
      return true;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
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
  }, []);

  const updateTaskStatus = useCallback(
    async (id: number, data: UpdateTaskRequest) => {
      setLoading(true);
      try {
        await tasksService.updateTaskStatus(id, data);
        return true;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await tasksService.deleteTask(id);
      return true;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    tasks,
    createTask,
    fetchTasks,
    deleteTask,
    updateTaskStatus,
  };
};

export default useTask;
