import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import { IoClose } from "react-icons/io5";
import Stack from "../../../shared/components/Stack";
import type { SessionResponse } from "../session.types";
import { formatToHour } from "../../../shared/utils/number.utils";
import { capitalize } from "../../../shared/utils/string.utils";
import Line from "../../../shared/components/Line";

import { PRESETS } from "../../home/ratio.const";
import InfoWrapper from "../../../shared/components/InfoWrapper";
import Button from "../../../shared/components/Button";

import { FaTrash } from "react-icons/fa6";
import { MdSave, MdModeEdit } from "react-icons/md";

import clsx from "clsx";

const SessionDetailsModal = ({
  session,
  task,
  close,
}: {
  session: SessionResponse;
  task: { id: number; name: string };
  close: () => void;
}) => {
  const preset = PRESETS.find((preset) => preset.value === session.ratio * 100);

  return (
    <ModalContainer close={close}>
      <Stack direction="row" justify="between">
        <h1 className="flex-1 font-bold text-xl line-clamp-1 break-all text-left pl-1">
          <div className="flex items-center gap-3">
            {capitalize(task.name)}
            <MdModeEdit
              size={22}
              className="cursor-pointer hover:scale-110 hover:text-primary transition duration-100"
            />
          </div>
        </h1>
        <IoClose
          size={30}
          className="cursor-pointer hover:scale-110 hover:text-danger transition duration-100"
          onClick={close}
        />
      </Stack>

      <div className="flex flex-col gap-3">
        <Stack className="gap-0! sm:gap-2!" direction="row" justify="between">
          <InfoWrapper size="md">Tempo de Foco</InfoWrapper>
          <Line />
          <InfoWrapper>{formatToHour(session.focus)}</InfoWrapper>
        </Stack>

        {session.rest > 0 && (
          <Stack className="gap-0! sm:gap-2!" direction="row" justify="between">
            <InfoWrapper size="md">Descanso calculado</InfoWrapper>
            <Line />
            <InfoWrapper>{formatToHour(session.rest)}</InfoWrapper>
          </Stack>
        )}

        {preset && preset.label && (
          <Stack className="gap-0! sm:gap-2!" direction="row" justify="between">
            <InfoWrapper size="md">Perfil de Descanso:</InfoWrapper>
            <Line />
            <InfoWrapper className={preset?.textClass}>
              {preset?.label}
            </InfoWrapper>
          </Stack>
        )}
      </div>
      <div className="flex gap-3 flex-col sm:flex-row">
        <Button
          icon={<FaTrash />}
          className={clsx(
            "w-full! hover:bg-danger hover:border-danger! bg-transparent ",
            "border border-white/10",
          )}
          variant="danger"
        >
          Deletar
        </Button>
        <Button
          icon={<MdSave size={20} />}
          variant="secondary"
          className={clsx(
            "w-full! hover:bg-success hover:text-black/80 hover:border-success! bg-transparent ",
            "border border-white/10",
          )}
        >
          Salvar
        </Button>
      </div>
    </ModalContainer>
  );
};

export default SessionDetailsModal;
