import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";

import { formatToHour } from "../../../../shared/utils/number.utils";
import SessionDetailsModal from "../SessionDetailsModal";
import { useState } from "react";
import type { SessionType } from "../../types/sessions.types";
import { capitalize } from "../../../../shared/utils/string.utils";

const Session = ({ session }: { session: SessionType }) => {
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
            "border border-white/10 shadow-lg py-6 px-4 cursor-pointer rounded-lg w-full ",
            "hover:scale-105 duration-200 hover:shadow-xl",
          )}
        >
          <span className="text-xl">{capitalize(session.task.name)}</span>
          <span className="text-xl">{formatToHour(session.focus)}</span>
        </Stack>
      </div>
      {showSessionDetailsModal && (
        <SessionDetailsModal session={session} close={handleDetailsModal} />
      )}
    </>
  );
};

export default Session;
