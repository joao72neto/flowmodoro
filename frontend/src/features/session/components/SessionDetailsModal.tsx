import ModalContainer from "../../../components/common/modals/ModalContainer";
import { IoClose } from "react-icons/io5";
import Stack from "../../../components/common/Stack";
import type { SessionType } from "../types/sessions.types";
import { formatToHour, formatToPercentage } from "../../../shared/utils/number.utils";
import clsx from "clsx";
import { capitalize } from "../../../shared/utils/string.utils";
import Line from "../../../components/common/Line";

const SessionDetailsModal = ({
  session,
  close,
}: {
  session: SessionType;
  close: () => void;
}) => {
  return (
    <ModalContainer>
      <div>
        <Stack direction="row" justify="between" className="pb-4">
          <h1 className="font-bold text-xl">{capitalize(session.task.name)}</h1>
          <IoClose size={30} className="cursor-pointer" onClick={close} />
        </Stack>

        <Stack
          direction="row"
          justify="center"
          align="right"
          className={clsx(
            "relative pb-3 border-b border-t border-white/20",
            "before:absolute",
            "before:inset-0",
            "before:border-b before:border-t",
            "before:border-white/20",
            "before:animate-pulse",
            "before:pointer-events-none",
          )}
        >
          <h2>Foco: {formatToHour(session.focus)}</h2>
          <span className="text-3xl text-white/20 animate-pulse">|</span>
          <h2>Descanso: {formatToHour(session.rest)}</h2>
        </Stack>
      </div>
      <div className="flex flex-col gap-3">
        <Stack direction="row" justify="between">
          <p>Tempo total:</p>
          <Line />
          <p>{formatToHour(session.focus + session.rest)}</p>
        </Stack>

        <Stack direction="row" justify="between">
          <p>Interrupções:</p>
          <Line />
          <p> {session.interruptions}</p>
        </Stack>

        <Stack direction="row" justify="between">
          <p>Razão de Descanso:</p>
          <Line />
          <p>{formatToPercentage(session.ratio)}</p>
        </Stack>
      </div>
    </ModalContainer>
  );
};

export default SessionDetailsModal;
