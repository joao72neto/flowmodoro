import clsx from "clsx";
import Stack from "../../../common/Stack";

import { formatToHour } from "../../../../utils/number.utils";

const Session = ({
  activity,
  duration,
}: {
  activity: string;
  duration: number;
}) => {
  return (
    <Stack
      direction="row"
      justify="between"
      className={clsx(
        "border border-white/10 shadow-lg py-6 px-4 cursor-pointer rounded-lg w-full ",
        "hover:scale-115 duration-200 hover:shadow-xl",
      )}
    >
      <span className="text-xl">{activity}</span>
      <span className="text-xl">{formatToHour(duration)}</span>
    </Stack>
  );
};

export default Session;
