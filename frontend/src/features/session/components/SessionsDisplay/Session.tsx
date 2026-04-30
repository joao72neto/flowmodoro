import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";

import { formatToHour } from "../../../../shared/utils/number.utils";
import SessionDetailsModal from "../SessionDetailsModal";
import { useState } from "react";
import type { SessionResponse } from "../../session.types";

const Session = ({
  session,
  task,
}: {
  session: SessionResponse;
  task: { id: number; name: string };
}) => {
  const [showSessionDetailsModal, setShowSessionDetailsModal] =
    useState<boolean>(false);

  const handleDetailsModal = () => {
    setShowSessionDetailsModal(!showSessionDetailsModal);
  };

  return (
    <>
      <div onClick={handleDetailsModal} className="w-full">
        <Stack
          direction="row"
          justify="between"
          className={clsx(
            "border border-white/5 shadow-md p-2 sm:p-3 cursor-pointer rounded-lg w-full",
            "hover:bg-white/4 duration-200 bg-black/20",
          )}
        >
          <span className="flex-1 text-sm sm:text-base opacity-70">
            {task.name}
          </span>
          <span
            className={clsx(
              "text-xs sm:text-sm bg-white/5 border border-white/5 ",
              "px-2 py-0.5 rounded-md shadow",
            )}
          >
            {formatToHour(session.focus)}
          </span>
        </Stack>
      </div>
      {showSessionDetailsModal && (
        <SessionDetailsModal
          session={session}
          task={task}
          close={handleDetailsModal}
        />
      )}
    </>
  );
};

export default Session;
