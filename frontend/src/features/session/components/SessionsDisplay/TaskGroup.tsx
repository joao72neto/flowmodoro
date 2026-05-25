import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";
import type { ITaskGroup, SessionResponse } from "../../session.types";
import Session from "./Session";

import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { useState } from "react";
import SessionDetailsModal from "../SessionDetailsModal";
import { useModal } from "../../../../shared/modal.context";

const TaskGroup = ({ taskGroup }: { taskGroup: ITaskGroup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionResponse>(
    taskGroup.sessions[0],
  );

  const { showWarning, hideModal } = useModal();

  const handleToggle = () => setIsOpen(!isOpen);
  const isTogglable = taskGroup.sessions.length > 1;

  const handleDeleteSession = () => {
    setShowSessionDetailsModal(false);
    showWarning({
      title: "Deseja mesmo excluir essa sessão?",
      message: "Esta operação nao pode ser desfeita.",
      cancel: () => setShowSessionDetailsModal(true),
      action: hideModal,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <Stack
          className={clsx(
            "w-full bg-white/4 rounded-xl p-3 sm:p-4 border border-white/10",
            "shadow-xl transition-colors hover:bg-white/3 cursor-pointer",
          )}
          gap={3}
          onClick={
            isTogglable ? handleToggle : () => setShowSessionDetailsModal(true)
          }
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
                    "hover:bg-black/20 transition-colors bg-black/10",
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
              <Session
                key={session.id}
                session={session}
                onClick={() => {
                  setSelectedSession(session);
                  setShowSessionDetailsModal(true);
                }}
              />
            ))}
          </Stack>
        </AnimatedCollapse>
      </div>

      {showSessionDetailsModal && (
        <SessionDetailsModal
          deleteSession={handleDeleteSession}
          session={selectedSession}
          task={taskGroup.task}
          close={() => setShowSessionDetailsModal(false)}
        />
      )}
    </>
  );
};

export default TaskGroup;
