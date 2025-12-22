import { useState } from "react";
import tasksService from "../services/tasks.service";

const useCreateTask = () => {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState();
  const createTask = async (data: any) => {
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

  return { createTask, loading, task, setTask };
};

export default useCreateTask;
