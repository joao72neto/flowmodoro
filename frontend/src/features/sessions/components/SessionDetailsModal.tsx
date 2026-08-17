import ModalContainer from "../../../shared/components/Modal/ModalContainer";
import { IoClose } from "react-icons/io5";
import Stack from "../../../shared/components/Stack";
import { formatToHour } from "../../../shared/utils/number.utils";
import { capitalize } from "../../../shared/utils/string.utils";

import { PRESETS } from "../../timer/consts/ratio-presets";
import Button from "../../../shared/components/buttons/Button/Button";

import { FaTrash } from "react-icons/fa6";
import { MdSave, MdModeEdit, MdCancel } from "react-icons/md";

import clsx from "clsx";
import { useEffect, useState } from "react";
import IconButton from "../../../shared/components/buttons/IconButton";
import { sessionStorageKeys } from "../../../shared/utils/storage.utils";
import Label from "../../../shared/components/labels/Label";
import LabeledValue from "../../../shared/components/labels/LabeledValue";
import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import { useSessionContext } from "../context/sessions.context";
import SessionSelector from "./SessionCreation/SessionSelector";
import Input from "../../../shared/components/inputs/Input";
import { useModal } from "../../../shared/contexts/modal/modal.context";
import type { SessionDTO } from "../dtos/sessions-response";
import { useDeleteSession, useUpdateSession } from "../hooks/useSessions";
import { useFetchTagsByProject } from "../../tags/hooks/useTags";

import { isNative } from "../../../consts/platform";

interface SessionDraft {
  title: string;
  selectedProjectId: string | null;
  selectedTagId: string | null;
  ratio: number;
  focus: number;
}

const SessionDetailsModal = ({
  isOpen,
  setIsOpen,
  session,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  session: SessionDTO;
}) => {
  const { showDefault, hideModal } = useModal();

  const { mutate: updateSession, isPending: isUpdating } = useUpdateSession();
  const { mutate: deleteSession } = useDeleteSession();

  const { projects = [] } = useSessionContext();

  const preset = PRESETS.find((preset) => preset.value === session.ratio * 100);
  const draftKey = `${sessionStorageKeys.sessionTitle}-${session.id}`;

  const getDraft = (): SessionDraft | null => {
    const saved = sessionStorage.getItem(draftKey);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const draft = getDraft();

  const [mode, setMode] = useState<"view" | "edit">(draft ? "edit" : "view");

  const [title, setTitle] = useState<string>(
    draft ? draft.title : session.name,
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    draft ? draft.selectedProjectId : session.project?.id || null,
  );
  const [selectedTagId, setSelectedTagId] = useState<string | null>(
    draft ? draft.selectedTagId : session.tag?.id || null,
  );
  const [ratio, setRatio] = useState<number>(
    draft ? draft.ratio : session.ratio,
  );
  const [focus, setFocus] = useState<number>(
    draft ? draft.focus : session.focus,
  );

  const { data: tags = [] } = useFetchTagsByProject(selectedProjectId || "");

  useEffect(() => {
    if (mode === "view") {
      sessionStorage.removeItem(draftKey);
      setTitle(session.name);
      setSelectedProjectId(session.project?.id || null);
      setSelectedTagId(session.tag?.id || null);
      setRatio(session.ratio);
      setFocus(session.focus);
    }
  }, [mode, session, draftKey]);

  useEffect(() => {
    if (mode === "edit") {
      const currentDraft: SessionDraft = {
        title,
        selectedProjectId,
        selectedTagId,
        ratio,
        focus,
      };
      sessionStorage.setItem(draftKey, JSON.stringify(currentDraft));
    }
  }, [mode, title, selectedProjectId, selectedTagId, ratio, focus, draftKey]);

  const isReadyToSave =
    title.trim() !== "" &&
    (title.trim() !== session.name.trim() ||
      selectedProjectId !== (session.project?.id || null) ||
      selectedTagId !== (session.tag?.id || null) ||
      ratio !== session.ratio ||
      focus !== session.focus);

  const handleSave = () => {
    const updatedRest = Math.round(focus * ratio);
    updateSession(
      {
        id: session.id,
        data: {
          name: title,
          focus: focus,
          ratio: ratio,
          rest: updatedRest,
          projectId: selectedProjectId !== null ? selectedProjectId : "",
          tagId: selectedTagId !== null ? selectedTagId : "",
        },
      },
      {
        onSuccess: () => {
          sessionStorage.removeItem(draftKey);
          setMode("view");
          setIsOpen(false);
        },
      },
    );
  };

  const handleDelete = () => {
    showDefault({
      title: "Deseja mesmo excluir essa sessão?",
      message: "Esta operação não pode ser desfeita.",
      cancel: () => {},
      action: handleConfirmDelete,
    });
  };

  const handleConfirmDelete = () => {
    deleteSession(session.id, {
      onSuccess: () => {
        sessionStorage.removeItem(draftKey);
        setIsOpen(false);
        hideModal();
      },
    });
  };

  const handleClose = () => {
    if (isReadyToSave) {
      showDefault({
        title: "Deseja mesmo fechar sem salvar?",
        message: "Seus dados não serão salvos.",
        cancelLabel: "Voltar",
        cancel: () => {},
        action: () => {
          sessionStorage.removeItem(draftKey);
          setIsOpen(false);
          hideModal();
        },
      });
      return;
    }
    sessionStorage.removeItem(draftKey);
    setIsOpen(false);
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      enableHeavyAnimations={!isNative}
      close={handleClose}
      className="!gap-10 !overflow-visible"
    >
      <Stack direction="row" justify="between" gap={5} className="w-full">
        {mode === "edit" ? (
          <input
            type="text"
            value={title.trim()}
            onChange={(e) => setTitle(e.target.value)}
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
        {mode === "view" ? (
          <>
            {session.focus && (
              <LabeledValue
                name="Tempo Total"
                value={formatToHour(session.focus)}
              />
            )}
            {session.project.id !== "" && (
              <LabeledValue
                name="Projeto"
                value={<Label>{session.project.name}</Label>}
              />
            )}
            {session.tag.id !== "" && (
              <LabeledValue
                name="Tag"
                value={<Label variant="secondary">{session.tag.name}</Label>}
              />
            )}
            {preset && (
              <LabeledValue
                name="Perfil de Descanso"
                value={
                  <span
                    className={clsx(
                      "font-bold text-sm sm:text-base px-3 py-1 rounded-lg bg-neutral-80/50 border border-border",
                      preset.textClass,
                    )}
                  >
                    {preset.label}
                  </span>
                }
              />
            )}
          </>
        ) : (
          <>
            <LabeledValue
              name="Tempo Total (minutos)"
              value={
                <Input
                  type="number"
                  min={1}
                  value={Math.floor(focus / 60)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFocus(val * 60);
                  }}
                  className="w-17! text-sm! sm:text-base!"
                />
              }
            />
            <LabeledValue
              name="Projeto"
              value={
                <SessionSelector
                  value={
                    projects.find((p) => p.id === selectedProjectId) || null
                  }
                  onChange={(project) => {
                    setSelectedProjectId(project?.id ?? null);
                    setSelectedTagId(null);
                  }}
                  title="Projetos"
                  variant="primary"
                  items={projects}
                  placeholder="Pesquisar projeto..."
                  emptyMsg="Nenhum projeto encontrado"
                  icon={<GoProject />}
                  align="right"
                >
                  Projetos
                </SessionSelector>
              }
            />
            <LabeledValue
              name="Tag"
              value={
                <SessionSelector
                  value={tags.find((t) => t.id === selectedTagId) || null}
                  onChange={(tag) => setSelectedTagId(tag?.id ?? null)}
                  title="Tags"
                  variant="secondary"
                  items={tags}
                  placeholder="Pesquisar tag..."
                  emptyMsg={
                    selectedProjectId
                      ? "Nenhuma tag encontrada"
                      : "Selecione um projeto primeiro"
                  }
                  icon={<IoMdPricetag />}
                  align="right"
                >
                  Tags
                </SessionSelector>
              }
            />
            <LabeledValue
              className="flex-col! items-start!"
              name="Perfil de Descanso:"
              value={
                <div className="flex gap-2">
                  {PRESETS.map((p) => {
                    const isSelected = p.value === ratio * 100;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setRatio(p.value / 100)}
                        className={clsx(
                          "font-bold text-xs sm:text-sm px-3 py-1 rounded-lg border transition-all duration-200 cursor-pointer",
                          isSelected
                            ? clsx("bg-neutral-80/80", p.textClass)
                            : "bg-neutral-90/30 border-border text-neutral-40 hover:text-neutral-20 hover:border-neutral-60",
                        )}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              }
            />
          </>
        )}
      </div>

      <div className="flex gap-4 flex-col-reverse sm:flex-row w-full">
        {mode === "view" ? (
          <>
            <Button
              onClick={handleDelete}
              icon={<FaTrash size={16} />}
              variant="danger"
              className="flex-1 bg-neutral-20/30 !border-border hover:!bg-danger hover:!text-white transition-all"
            >
              Excluir
            </Button>
            <Button
              icon={<MdModeEdit size={20} />}
              variant="primary"
              onClick={() => setMode("edit")}
              className="flex-[2] shadow-lg shadow-primary/20"
            >
              Editar
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                sessionStorage.removeItem(draftKey);
                setMode("view");
              }}
              disabled={isUpdating}
              icon={<MdCancel size={16} />}
              variant="danger"
              className="flex-1 bg-neutral-20/30 !border-border hover:!bg-danger hover:!text-white transition-all"
            >
              Cancelar
            </Button>
            <Button
              icon={<MdSave size={20} />}
              variant="primary"
              disabled={!isReadyToSave || isUpdating}
              onClick={handleSave}
              className="flex-[2] shadow-lg shadow-primary/20"
            >
              Salvar Alterações
            </Button>
          </>
        )}
      </div>
    </ModalContainer>
  );
};

export default SessionDetailsModal;
