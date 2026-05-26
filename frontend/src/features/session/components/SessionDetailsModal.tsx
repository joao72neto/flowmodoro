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
import { useRef, useState } from "react";
import { useModal } from "../../../shared/modal.context";
import { localStorageKeys } from "../../../shared/utils/local-storage.utils";

const SessionDetailsModal = ({
  isOpen,
  setIsOpen,
  session,
  task,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  session: SessionResponse;
  task: { id: number; name: string };
}) => {
  if (!isOpen) return null;

  const preset = PRESETS.find((preset) => preset.value === session.ratio * 100);

  const [title, setTitle] = useState<string>(
    sessionStorage.getItem(localStorageKeys.sessionTitle) || task.name,
  );
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isReadyToSave = title.trim() !== task.name.trim();

  const handleEditTitle = () => {
    setIsEditing(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const { showWarning, hideModal } = useModal();

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    sessionStorage.setItem(localStorageKeys.sessionTitle, e.target.value);
  };

  const handleConfirm = () => {
    hideModal();
    sessionStorage.removeItem(localStorageKeys.sessionTitle);
  };

  const handleDeleteSession = () => {
    setIsOpen(false);
    showWarning({
      title: "Deseja mesmo excluir essa sessão?",
      message: "Esta operação não pode ser desfeita.",
      cancel: () => setIsOpen(true),
      action: handleConfirm,
    });
  };

  const handleClose = () => {
    if (isReadyToSave) {
      setIsOpen(false);
      showWarning({
        title: "Deseja mesmo fechar sem salvar?",
        message: "Seus dados não serão salvos.",
        cancel: () => setIsOpen(true),
        action: handleConfirm,
      });
      return;
    }
    setIsOpen(false);
  };

  const handleSave = () => {
    setIsOpen(false);
    sessionStorage.removeItem(localStorageKeys.sessionTitle);
  };

  return (
    <ModalContainer close={handleClose}>
      <Stack direction="row" justify="between">
        <h1 className="flex-1 font-bold text-md sm:text-xl line-clamp-1 break-all text-left pl-1">
          <div className="flex items-center gap-3">
            <div className="inline-grid items-center font-bold min-w-0 max-w-md line-clamp-1">
              <span className="invisible col-start-1 row-start-1 whitespace-pre pb-2 line-clamp-1">
                {title}
              </span>
              <input
                type="text"
                value={capitalize(title)}
                onChange={handleChangeTitle}
                size={1}
                className={clsx(
                  "col-start-1 row-start-1 w-full focus:outline-none pb-1 bg-transparent focus:border-b",
                  "transition duration-200 ease-in-out w-fit focus:border-primary",
                )}
                ref={inputRef}
                onBlur={() => setIsEditing(false)}
                disabled={!isEditing}
              />
            </div>
            <MdModeEdit
              onClick={handleEditTitle}
              className={clsx(
                "text-xl sm:text-2xl cursor-pointer shrink-0 hover:scale-110 hover:text-primary transition duration-100",
                isEditing && "text-primary",
              )}
            />
          </div>
        </h1>
        <IoClose
          size={30}
          className="cursor-pointer hover:scale-110 hover:text-danger transition duration-100"
          onClick={handleClose}
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
          onClick={handleDeleteSession}
          icon={<FaTrash />}
          className={clsx(
            "w-full! hover:bg-danger hover:border-danger! bg-transparent ",
            "border border-white/10 text-sm! sm:text-base!",
          )}
          variant="danger"
          title="Excluir sessão"
        >
          Deletar
        </Button>
        <Button
          icon={<MdSave className="text-lg! sm:text-xl!" />}
          variant="secondary"
          disabled={!isReadyToSave}
          onClick={handleSave}
          title={
            isReadyToSave
              ? "Salvar alterações"
              : "Edite o nome da sessão para poder salvar"
          }
          className={clsx(
            "w-full! not-disabled:hover:bg-success not-disabled:hover:text-black/80 ",
            "not-disabled:hover:border-success! border border-white/10 bg-transparent",
            "disabled:scale-100 text-sm! sm:text-base!",
          )}
        >
          Salvar
        </Button>
      </div>
    </ModalContainer>
  );
};

export default SessionDetailsModal;
