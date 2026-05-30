import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";

import { formatToHour } from "../../../../shared/utils/number.utils";
import type { SessionResponse } from "../../session.types";
import { PRESETS } from "../../../home/ratio.const";

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
          "border border-white/5 shadow-md p-3 sm:p-4 cursor-pointer rounded-xl w-full",
          "hover:bg-neutral-40/50 transition duration-200 bg-neutral-60/40 backdrop-blur-sm",
        )}
      >
        <span className={"flex-1 text-sm sm:text-base"}>{session.name}</span>
        <span
          className={clsx(
            "text-sm bg-white/5 border border-white/5",
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
