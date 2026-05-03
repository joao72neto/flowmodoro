import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";

import { formatToHour } from "../../../../shared/utils/number.utils";
import type { SessionResponse } from "../../session.types";

const Session = ({
  session,
  onClick,
}: {
  session: SessionResponse;
  onClick?: () => void;
}) => {
  return (
    <div onClick={onClick} className="w-full">
      <Stack
        direction="row"
        justify="between"
        className={clsx(
          "border border-white/5 shadow-md p-2 sm:p-3 cursor-pointer rounded-lg w-full",
          "hover:bg-black/30 duration-200 bg-black/20",
        )}
      >
        <span className="flex-1 text-sm sm:text-base">{session.name}</span>
        <span
          className={clsx(
            "text-sm bg-white/5 border border-white/5 ",
            "px-2 py-0.5 rounded-md shadow",
          )}
        >
          {formatToHour(session.focus)}
        </span>
      </Stack>
    </div>
  );
};

export default Session;
