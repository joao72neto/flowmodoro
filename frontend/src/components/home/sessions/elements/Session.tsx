import clsx from "clsx";
import Stack from "../../../common/Stack";

import { formatToHour } from "../../../../utils/number.utils";
import { useModal } from "../../../../contexts/ModalContext";

const Session = ({
  activity,
  duration,
  sessionId,
}: {
  sessionId: number;
  activity: string;
  duration: number;
}) => {
  const { showDefault } = useModal();

  const handleDetailsModal = () => {
    showDefault(
      "Detalhes da sessão",
      "Detalhes da sessão de id " + sessionId,
      () => {},
    );
  };

  return (
    <div onClick={handleDetailsModal} className="w-full">
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
    </div>
  );
};

export default Session;
