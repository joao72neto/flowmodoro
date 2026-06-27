import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import { IoClose } from "react-icons/io5";
import Stack from "../../../shared/components/Stack";
import { formatToHour } from "../../../shared/utils/number.utils";
import { capitalize } from "../../../shared/utils/string.utils";

import { PRESETS } from "../../timer/ratio.const";
import Button from "../../../shared/components/buttons/Button";

import { FaTrash } from "react-icons/fa6";
import { MdSave, MdModeEdit } from "react-icons/md";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { useModal } from "../../../shared/modal.context";
import IconButton from "../../../shared/components/buttons/IconButton";
import { useDeleteSession, useUpdateSession } from "../hooks/useSessionsApi";
import type { SessionResponse } from "../sessions.types";
import { sessionStorageKeys } from "../../../shared/utils/storage.utils";
import Label from "../../../shared/components/Label";

const SessionDetailsModal = ({
  isOpen,
  setIsOpen,
  session,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  session: SessionResponse;
}) => {
  if (!isOpen) return null;

  const { showWarning, hideModal, setModalLoading } = useModal();

  const { mutate: updateSession, isPending: isUpdating } = useUpdateSession();
  const { mutate: deleteSession } = useDeleteSession();

  const preset = PRESETS.find((preset) => preset.value === session.ratio * 100);
  const draftKey = `${sessionStorageKeys.sessionTitle}-${session.id}`;

  const [title, setTitle] = useState<string>(
    sessionStorage.getItem(draftKey) || session.name,
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const draft = sessionStorage.getItem(draftKey);
    setTitle(draft || session.name);
  }, [session.id, session.name, draftKey]);

  const isReadyToSave = title.trim() !== session.name.trim();

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    sessionStorage.setItem(draftKey, e.target.value);
  };

  const handleSave = () => {
    updateSession(
      { id: session.id, data: { name: title } },
      {
        onSuccess: () => {
          sessionStorage.removeItem(draftKey);
          setIsOpen(false);
        },
      },
    );
  };

  const handleDelete = () => {
    showWarning({
      title: "Deseja mesmo excluir essa sessão?",
      message: "Esta operação não pode ser desfeita.",
      cancel: () => {},
      action: handleConfirmDelete,
    });
  };

  const handleConfirmDelete = () => {
    setModalLoading(true);
    deleteSession(session.id, {
      onSuccess: () => {
        sessionStorage.removeItem(draftKey);
        setModalLoading(false);
        setIsOpen(false);
        hideModal();
      },
    });
  };

  const handleClose = () => {
    if (isReadyToSave) {
      setIsOpen(false);
      showWarning({
        title: "Deseja mesmo fechar sem salvar?",
        message: "Seus dados não serão salvos.",
        cancel: () => setIsOpen(true),
        action: () => {
          sessionStorage.removeItem(draftKey);
          hideModal();
        },
      });
      return;
    }
    setIsOpen(false);
  };

  return (
    <ModalContainer close={handleClose} className="!gap-10">
      <Stack direction="row" justify="between" gap={5} className="w-full">
        <div className="flex-1 flex items-center gap-4 min-w-0">
          <div className="relative flex-1 min-w-0 group">
            <div className="inline-grid items-center font-bold w-full">
              {isEditing ? (
                <input
                  type="text"
                  value={capitalize(title)}
                  onChange={handleChangeTitle}
                  placeholder="Nome da sessão"
                  className={clsx(
                    "col-start-1 row-start-1 w-full",
                    "focus:outline-none bg-transparent",
                    "text-lg sm:text-2xl font-bold pb-1",
                    "border-b-2 border-primary text-neutral-10",
                  )}
                />
              ) : (
                <div
                  className={clsx(
                    "col-start-1 row-start-1 w-full min-w-0",
                    "text-lg sm:text-2xl font-bold pb-1 text-left",
                    "border-b-2 border-transparent text-neutral-10",
                    "truncate cursor-default",
                  )}
                >
                  {capitalize(title) || "Nome da sessão"}
                </div>
              )}
            </div>
          </div>
          <IconButton
            icon={
              isEditing ? (
                <MdSave className="text-success animate-fade-in" size={24} />
              ) : (
                <MdModeEdit
                  className="text-neutral-20 hover:text-primary transition-colors"
                  size={24}
                />
              )
            }
            onClick={() => setIsEditing((prev) => !prev)}
          />
        </div>
        <IconButton
          icon={
            <IoClose
              size={32}
              className="text-neutral-20 hover:text-danger hover:rotate-90 transition-all duration-300"
            />
          }
          onClick={handleClose}
        />
      </Stack>

      <div className="flex flex-col gap-6 bg-neutral-80/50 p-5 rounded-2xl border border-border">
        <Stack direction="row" justify="between" className="w-full">
          <span className="text-neutral-20 font-medium text-sm sm:text-base">
            Tempo de Foco
          </span>
          <span className="font-mono text-lg sm:text-xl text-neutral-20">
            {formatToHour(session.focus)}
          </span>
        </Stack>

        {session.project && (
          <Stack direction="row" justify="between" className="w-full">
            <span className="text-neutral-20 font-medium text-sm sm:text-base">
              Projeto
            </span>
            <Label>{session.project.name}</Label>
          </Stack>
        )}

        {session.tag && (
          <Stack direction="row" justify="between" className="w-full">
            <span className="text-neutral-20 font-medium text-sm sm:text-base">
              Tag
            </span>
            <Label variant="secondary">{session.tag.name}</Label>
          </Stack>
        )}

        {preset && (
          <Stack direction="row" justify="between" className="w-full">
            <span className="text-neutral-20 font-medium text-sm sm:text-base">
              Perfil de Descanso
            </span>
            <span
              className={clsx(
                "font-bold text-sm sm:text-base px-3 py-1 rounded-lg bg-neutral-80/50 border border-border",
                preset.textClass,
              )}
            >
              {preset.label}
            </span>
          </Stack>
        )}
      </div>

      <div className="flex gap-4 flex-col-reverse sm:flex-row w-full">
        <Button
          onClick={handleDelete}
          icon={<FaTrash size={16} />}
          variant="danger"
          className="flex-1 bg-neutral-20/30 !border-border hover:!bg-danger hover:!text-white transition-all"
        >
          Excluir
        </Button>
        <Button
          icon={<MdSave size={20} />}
          variant="primary"
          disabled={!isReadyToSave || isUpdating}
          loading={isUpdating}
          onClick={handleSave}
          className="flex-[2] shadow-lg shadow-primary/20"
        >
          Salvar Alterações
        </Button>
      </div>
    </ModalContainer>
  );
};

export default SessionDetailsModal;
