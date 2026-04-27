import { useCallback, useState } from "react";
import tasksService from "../task.service";
import type {
  TaskResponse,
  TaskRequest,
  UpdateTaskRequest,
  UpdateTaskNameRequest,
} from "../task.types";
import { LOADING_TIMOUT } from "../../../app/loading.const";

const useTask = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);

  const createTask = useCallback(async (data: TaskRequest) => {
    let timer = setTimeout(() => setLoading(true), LOADING_TIMOUT);

    try {
      await tasksService.createTask(data);
      return true;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
      clearTimeout(timer);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    let timer = setTimeout(() => setLoading(true), LOADING_TIMOUT);

    try {
      const res = await tasksService.fetchTasks();
      const data: TaskResponse[] = res.data;
      setTasks(data);
      return data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
      clearTimeout(timer);
    }
  }, []);

  const updateTaskStatus = useCallback(
    async (id: number, data: UpdateTaskRequest) => {
      let timer = setTimeout(() => setLoading(true), LOADING_TIMOUT);

      try {
        await tasksService.updateTaskStatus(id, data);
        return true;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    },
    [],
  );

  const updateTask = useCallback(
    async (id: number, data: UpdateTaskNameRequest) => {
      let timer = setTimeout(() => setLoading(true), LOADING_TIMOUT);

      try {
        await tasksService.updateTask(id, data);
        return true;
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    },
    [],
  );

  const deleteTask = useCallback(async (id: number) => {
    let timer = setTimeout(() => setLoading(true), LOADING_TIMOUT);

    try {
      await tasksService.deleteTask(id);
      return true;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
      clearTimeout(timer);
    }
  }, []);

  return {
    loading,
    tasks,
    createTask,
    fetchTasks,
    deleteTask,
    updateTaskStatus,
    updateTask,
  };
};

export default useTask;
