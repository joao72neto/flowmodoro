import { useMemo } from "react";
import type { TaskResponse } from "../task.types";

const useActiveTask = (tasks: TaskResponse[]) => {
  const activeTask = useMemo(
    () => tasks.find((task) => !task.checked),
    [tasks],
  );

  return { activeTask };
};
export default useActiveTask;
