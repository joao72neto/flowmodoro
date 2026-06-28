import type { JSX } from "react";
import Stack from "../Stack";

const LabeledValue = ({
  name,
  value,
}: {
  name: string;
  value: string | JSX.Element | undefined;
}) => {
  return (
    <Stack direction="row" justify="between" className="w-full">
      <span className="text-neutral-20 font-medium text-sm sm:text-base">
        {name}
      </span>
      <span className="font-mono text-lg sm:text-xl text-neutral-20">
        {value}
      </span>
    </Stack>
  );
};

export default LabeledValue;
