import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";

import { formatToHour } from "../../../../shared/utils/number.utils";
import type { SessionResponse } from "../../sessions.types";
import { PRESETS } from "../../../timer/ratio.const";

const Session = ({
  session,
  onClick,
}: {
  session: SessionResponse;
  onClick?: () => void;
}) => {
  const preset = PRESETS.find((preset) => preset.value === session.ratio * 100);

  return (
    <div onClick={onClick} className="w-full">
      <Stack
        direction="row"
        justify="between"
        className={clsx(
          "border shadow-lg border-border p-3 sm:p-4 cursor-pointer rounded-xl w-full",
          "hover:bg-neutral-80/20 transition duration-200 bg-neutral-80/60",
        )}
      >
        <span className={"flex-1 text-sm sm:text-base"}>{session.name}</span>
        <span
          className={clsx(
            "text-sm bg-neutral-80/50 border border-border",
            "px-2 py-0.5 rounded-md shadow",
            preset?.textClass,
          )}
        >
          {formatToHour(session.focus)}
        </span>
      </Stack>
    </div>
  );
};

export default Session;
