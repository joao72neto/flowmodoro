import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";
import type { ITaskGroup } from "../../session.types";
import Session from "./Session";

import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { useState } from "react";

const TaskGroup = ({ taskGroup }: { taskGroup: ITaskGroup }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Stack
        className="w-full bg-white/4 rounded-xl p-3 sm:p-4 border border-white/10"
        gap={3}
      >
        <Stack
          direction="row"
          justify="between"
          align="center"
          className="w-full"
        >
          <div className="flex gap-3 items-center">
            {taskGroup.sessions.length > 0 && (
              <span
                onClick={handleToggle}
                className={clsx(
                  "cursor-pointer text-lg sm:text-xl font-medium line-clamp-1",
                  "break-all border border-white/10 rounded-lg px-3 py-1",
                  "hover:bg-white/10 transition-colors",
                )}
                title="Expandir sessões"
              >
                {taskGroup.sessions.length}
              </span>
            )}

            <span className="text-lg sm:text-xl font-medium line-clamp-1 break-all">
              {capitalize(taskGroup.task.name)}
            </span>
          </div>
          <span
            className={clsx(
              "text-sm sm:text-base bg-white/10 border border-white/10 ",
              "px-3 py-1 rounded-lg shadow font-semibold",
            )}
          >
            {formatToHour(taskGroup.taskTotalFocus)}
          </span>
        </Stack>
      </Stack>
      <AnimatedCollapse show={isOpen}>
        <Stack gap={2} className="pl-6 border-white/5 w-full">
          {taskGroup.sessions.map((session) => (
            <Session key={session.id} session={session} task={taskGroup.task} />
          ))}
        </Stack>
      </AnimatedCollapse>
    </div>
  );
};

export default TaskGroup;
