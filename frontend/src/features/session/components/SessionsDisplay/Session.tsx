import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";

import { formatToHour } from "../../../../shared/utils/number.utils";
import SessionDetailsModal from "../SessionDetailsModal";
import { useState } from "react";
import type { SessionResponse } from "../../session.types";
import { capitalize } from "../../../../shared/utils/string.utils";

const Session = ({ session }: { session: SessionResponse }) => {
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
            "border border-white/10 shadow-lg py-4 sm:py-6 px-4 cursor-pointer rounded-lg w-full ",
            "hover:scale-102 duration-200 hover:shadow-xl",
          )}
        >
          <span className="flex-1 text-lg sm:text-xl line-clamp-1 break-all">
            {capitalize(session.task.name)}
          </span>
          <span
            className={clsx(
              "text-lg sm:text-xl bg-white/10 border border-white/10 ",
              "px-2 py-1 rounded-lg shadow",
            )}
          >
            {formatToHour(session.focus)}
          </span>
        </Stack>
      </div>
      {showSessionDetailsModal && (
        <SessionDetailsModal session={session} close={handleDetailsModal} />
      )}
    </>
  );
};

export default Session;
