import { useEffect, useMemo } from "react";
import { useSessionContext } from "../../session/session.context";
import type { TaskResponse } from "../task.types";

const useActiveTask = (tasks: TaskResponse[]) => {
  const { setTaskId } = useSessionContext();

  const activeTask = useMemo(
    () => tasks.find((task) => !task.checked),
    [tasks],
  );

  useEffect(() => {
    if (activeTask) setTaskId(activeTask.id);
  }, [activeTask, setTaskId]);

  return { activeTask };
};
export default useActiveTask;
