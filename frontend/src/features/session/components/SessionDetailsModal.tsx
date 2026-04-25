import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import { IoClose } from "react-icons/io5";
import Stack from "../../../shared/components/Stack";
import type { SessionResponse } from "../session.types";
import { formatToHour } from "../../../shared/utils/number.utils";
import { capitalize } from "../../../shared/utils/string.utils";
import Line from "../../../shared/components/Line";

import { PRESETS } from "../../home/ratio.const";
import InfoWrapper from "../../../shared/components/InfoWrapper";

const SessionDetailsModal = ({
  session,
  close,
}: {
  session: SessionResponse;
  close: () => void;
}) => {
  const preset = PRESETS.find((preset) => preset.value === session.ratio * 100);

  return (
    <ModalContainer close={close}>
      <Stack direction="row" justify="between">
        <h1 className="flex-1 font-bold text-xl line-clamp-1 break-all text-left pl-1">
          {capitalize(session.task.name)}
        </h1>
        <IoClose size={30} className="cursor-pointer" onClick={close} />
      </Stack>

      <div className="flex flex-col gap-3">
        <Stack className="gap-0! sm:gap-2!" direction="row" justify="between">
          <InfoWrapper size="md">Tempo de Foco:</InfoWrapper>
          <Line />
          <InfoWrapper>{formatToHour(session.focus)}</InfoWrapper>
        </Stack>

        <Stack className="gap-0! sm:gap-2!" direction="row" justify="between">
          <InfoWrapper size="md">Descanso calculado:</InfoWrapper>
          <Line />
          <InfoWrapper>{formatToHour(session.rest)}</InfoWrapper>
        </Stack>

        <Stack className="gap-0! sm:gap-2!" direction="row" justify="between">
          <InfoWrapper size="md">Tempo total:</InfoWrapper>
          <Line />
          <InfoWrapper>
            {formatToHour(session.focus + session.rest)}
          </InfoWrapper>
        </Stack>

        <Stack className="gap-0! sm:gap-2!" direction="row" justify="between">
          <InfoWrapper size="md">Perfil de Descanso:</InfoWrapper>
          <Line />
          <InfoWrapper className={preset?.textClass}>
            {preset?.label}
          </InfoWrapper>
        </Stack>
      </div>
    </ModalContainer>
  );
};

export default SessionDetailsModal;
