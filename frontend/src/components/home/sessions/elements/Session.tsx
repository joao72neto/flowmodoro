import Stack from "../../../common/Stack";
import { CgDetailsMore } from "react-icons/cg";

const Session = ({
  activity,
  duration,
}: {
  activity: string;
  duration: string;
}) => {
  return (
    <Stack
      direction="row"
      justify="between"
      className="border border-white/10 shadow-lg py-6 px-4 rounded-lg w-full"
    >
      <span className="text-xl">{activity}</span>
      <span className="text-xl">{duration}</span>
      <span>
        <CgDetailsMore className="cursor-pointer text-[25px]" />
      </span>
    </Stack>
  );
};

export default Session;
