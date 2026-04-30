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
  const isTogglable = taskGroup.sessions.length > 1;

  return (
    <div className="flex flex-col gap-2 w-full cursor-pointer hover ">
      <Stack
        className={clsx(
          "w-full bg-white/4 rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/3",
          "shadow-xl transition-colors",
        )}
        gap={3}
        onClick={isTogglable ? handleToggle : undefined}
      >
        <Stack
          direction="row"
          justify="between"
          align="center"
          className="w-full"
        >
          <div className="flex gap-3 items-center">
            {isTogglable && (
              <span
                className={clsx(
                  "cursor-pointer text-lg sm:text-xl font-medium line-clamp-1",
                  "break-all border border-white/10 rounded-lg px-3 py-1",
                  "hover:bg-white/10 transition-colors bg-black/10",
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
        <Stack gap={2} className="px-1 border-white/5 w-full">
          {taskGroup.sessions.map((session) => (
            <Session key={session.id} session={session} task={taskGroup.task} />
          ))}
        </Stack>
      </AnimatedCollapse>
    </div>
  );
};

export default TaskGroup;
